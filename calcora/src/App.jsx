import { useMemo, useState } from 'react'
import { all, create, format } from 'mathjs'
import nerdamer from 'nerdamer/all'
import { createWorker } from 'tesseract.js'
import {
  Activity, ArrowDownRight, ArrowUpRight, BookOpen, Check, ChevronDown,
  CircleHelp, Clock3, Copy, Delete, Equal, FunctionSquare, History,
  Keyboard, Lightbulb, Menu, Moon, MoreHorizontal, RotateCcw, Search,
  Settings2, Sigma, Sparkles, Sun, Trash2, X
} from 'lucide-react'

const math = create(all, { number: 'number', precision: 14 })
const fmt = (n) => {
  if (typeof n === 'number' && !Number.isFinite(n)) return String(n)
  if (typeof n === 'number') return format(n, { precision: 12 })
  return String(n)
}
const clean = (s) => s.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-').replace(/π/g, 'pi').replace(/√\(/g, 'sqrt(')
const factorial = (n) => {
  if (!Number.isInteger(n) || n < 0 || n > 170) throw new Error('Factorial requires a whole number from 0 to 170.')
  let v = 1
  for (let i = 2; i <= n; i++) v *= i
  return v
}
function evaluateExpression(expression, angleMode) {
  let source = clean(expression.trim())
  if (!source) throw new Error('Enter a mathematical expression to calculate.')
  source = source.replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
  const scope = {
    pi: Math.PI, e: Math.E,
    sin: (x) => Math.sin(angleMode === 'DEG' ? x * Math.PI / 180 : x),
    cos: (x) => Math.cos(angleMode === 'DEG' ? x * Math.PI / 180 : x),
    tan: (x) => Math.tan(angleMode === 'DEG' ? x * Math.PI / 180 : x),
    asin: (x) => angleMode === 'DEG' ? Math.asin(x) * 180 / Math.PI : Math.asin(x),
    acos: (x) => angleMode === 'DEG' ? Math.acos(x) * 180 / Math.PI : Math.acos(x),
    atan: (x) => angleMode === 'DEG' ? Math.atan(x) * 180 / Math.PI : Math.atan(x),
    log: Math.log10, ln: Math.log, sqrt: Math.sqrt, abs: Math.abs,
    factorial, ans: 0
  }
  return math.evaluate(source, scope)
}
function solveEquation(input) {
  const equation = clean(input).replace(/\s+/g, '')
  if (!equation.includes('=')) throw new Error('Use an equals sign for an equation, such as 2x + 4 = 10.')
  const [left, right, ...rest] = equation.split('=')
  if (rest.length || !left || !right) throw new Error('Enter one complete equation with a single equals sign.')
  const variable = (equation.match(/[a-z]/i) || [])[0]
  if (!variable) throw new Error('No variable found. Try an equation such as 2x + 4 = 10.')
  const solutions = nerdamer.solveEquations(`${left}=(${right})`, variable)
  if (!solutions || !solutions.length) throw new Error('No solution found for this equation.')
  return { variable, solutions: solutions.map((s) => Array.isArray(s) ? s[1] : s) }
}
function makeSteps(expression, result, angleMode) {
  const source = clean(expression.trim()).replace(/(\d+(?:\.\d+)?)%/g, '($1/100)')
  const scope = {
    pi: Math.PI, e: Math.E,
    sin: (x) => Math.sin(angleMode === 'DEG' ? x * Math.PI / 180 : x),
    cos: (x) => Math.cos(angleMode === 'DEG' ? x * Math.PI / 180 : x),
    tan: (x) => Math.tan(angleMode === 'DEG' ? x * Math.PI / 180 : x),
    asin: (x) => angleMode === 'DEG' ? Math.asin(x) * 180 / Math.PI : Math.asin(x),
    acos: (x) => angleMode === 'DEG' ? Math.acos(x) * 180 / Math.PI : Math.acos(x),
    atan: (x) => angleMode === 'DEG' ? Math.atan(x) * 180 / Math.PI : Math.atan(x),
    log: Math.log10, ln: Math.log, sqrt: Math.sqrt, abs: Math.abs, factorial
  }
  const steps = []
  try {
    let current = math.parse(source).toString()
    for (let pass = 0; pass < 20; pass++) {
      const root = math.parse(current)
      const nodes = []
      root.forEach((node) => {
        if ((node.isOperatorNode || node.isFunctionNode) && node.toString() !== current) nodes.push(node)
      })
      nodes.sort((a, b) => a.toString().length - b.toString().length)
      let changed = false
      for (const node of nodes) {
        const part = node.toString()
        let value
        try { value = math.evaluate(part, scope) } catch { continue }
        if (typeof value !== 'number' || !Number.isFinite(value)) continue
        const escaped = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const next = current.replace(new RegExp(escaped), `(${fmt(value)})`)
        if (next !== current) {
          steps.push({ label: `Evaluate ${part}`, equation: next })
          current = next
          changed = true
          break
        }
      }
      if (!changed) break
    }
    if (!steps.length || current !== fmt(result)) steps.push({ label: 'Evaluate the remaining expression', equation: `= ${fmt(result)}` })
  } catch {
    steps.push({ label: 'Apply the order of operations', equation: `${source} = ${fmt(result)}` })
  }
  steps.push({ label: 'Final answer', equation: `= ${fmt(result)}`, final: true })
  return steps
}
function equationSteps(input, variable, solutions) {
  const [left, right] = clean(input).split('=').map((v) => v.trim())
  const f = (x) => Number(math.evaluate(`(${left})-(${right})`, { [variable]: x }))
  try {
    const y0 = f(0), y1 = f(1), ym1 = f(-1)
    const a = (y1 + ym1 - 2 * y0) / 2
    const b = (y1 - ym1) / 2
    const c = y0
    const nice = (n) => fmt(Math.abs(n))
    if (Math.abs(a) < 1e-10) {
      if (Math.abs(b) < 1e-10) return [{ label: 'Compare both sides', equation: `${left} = ${right}` }, { label: 'Result', equation: solutions.map(v => `${variable} = ${v}`).join(', '), final: true }]
      const rhs = -c
      return [
        { label: 'Move all variable terms to the left and constants to the right', equation: `${fmt(b)}${variable} = ${fmt(rhs)}` },
        { label: `Divide both sides by ${fmt(b)}`, equation: `${variable} = ${fmt(rhs)} ÷ ${fmt(b)}` },
        { label: 'Simplify', equation: `${variable} = ${fmt(rhs / b)}` },
        { label: 'Final answer', equation: solutions.map(v => `${variable} = ${v}`).join(', '), final: true }
      ]
    }
    if (Math.abs(f(2) - (4*a + 2*b + c)) > 1e-7) throw new Error('Higher-degree equation')
    const discriminant = b*b - 4*a*c
    return [
      { label: 'Move every term to the left side', equation: `${fmt(a)}${variable}² ${b < 0 ? '−' : '+'} ${nice(b)}${variable} ${c < 0 ? '−' : '+'} ${nice(c)} = 0` },
      { label: 'Identify the coefficients', equation: `a = ${fmt(a)},  b = ${fmt(b)},  c = ${fmt(c)}` },
      { label: 'Use the quadratic formula', equation: `${variable} = (−b ± √(b² − 4ac)) ÷ 2a` },
      { label: 'Substitute the coefficients', equation: `${variable} = (${fmt(-b)} ± √(${fmt(b*b)} − ${fmt(4*a*c)})) ÷ ${fmt(2*a)}` },
      { label: 'Calculate the discriminant', equation: `b² − 4ac = ${fmt(discriminant)}` },
      { label: 'Calculate the roots', equation: solutions.map((v) => `${variable} = ${v}`).join('  or  ') },
      { label: 'Final answer', equation: solutions.map(v => `${variable} = ${v}`).join(', '), final: true }
    ]
  } catch {
    return [
      { label: 'Original equation', equation: `${left} = ${right}` },
      { label: 'Solve for the variable', equation: solutions.map(v => `${variable} = ${v}`).join(', '), final: true }
    ]
  }
}

const scientific = [
  ['sin','sin('], ['cos','cos('], ['tan','tan('], ['√','sqrt('],
  ['x²','^2'], ['xʸ','^'], ['log','log('], ['ln','ln('],
  ['(', '('], [')', ')'], ['π','pi'], ['e','e'],
  ['asin','asin('], ['acos','acos('], ['atan','atan('], ['n!','!']
]
const standard = [
  ['AC','clear'], ['±','sign'], ['%','%'], ['÷','/'],
  ['7','7'], ['8','8'], ['9','9'], ['×','*'],
  ['4','4'], ['5','5'], ['6','6'], ['−','-'],
  ['1','1'], ['2','2'], ['3','3'], ['+','+'],
  ['⌫','back'], ['0','0'], ['.','.'], ['=','equals']
]
function App() {
  const [expression, setExpression] = useState('0')
  const [answer, setAnswer] = useState('0')
  const [angleMode, setAngleMode] = useState('DEG')
  const [activeTab, setActiveTab] = useState('calculator')
  const [solverInput, setSolverInput] = useState('')
  const [solution, setSolution] = useState(null)
  const [history, setHistory] = useState([])
  const [showHistory, setShowHistory] = useState(false)
  const [scientificOpen, setScientificOpen] = useState(true)
  const [dark, setDark] = useState(true)
  const [copied, setCopied] = useState(false)
  const [ocrBusy, setOcrBusy] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [photoPreview, setPhotoPreview] = useState('')

  const preview = useMemo(() => {
    try {
      if (!expression || expression === '0') return '0'
      return fmt(evaluateExpression(expression, angleMode))
    } catch { return '' }
  }, [expression, angleMode])

  function pushHistory(expr, result) {
    setHistory((h) => [{ id: Date.now(), expr, result: fmt(result), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...h].slice(0, 30))
  }
  function insert(value) {
    setExpression((old) => old === '0' && /^[0-9.]$/.test(value) ? value : old + value)
  }
  function calculate() {
    try {
      const result = evaluateExpression(expression, angleMode)
      setAnswer(fmt(result)); pushHistory(expression, result); setExpression(fmt(result))
    } catch (e) { setAnswer(e.message) }
  }
  function pressKey(key, value) {
    if (value === 'clear') { setExpression('0'); setAnswer('0'); return }
    if (value === 'back') { setExpression((s) => s.length <= 1 ? '0' : s.slice(0, -1)); return }
    if (value === 'sign') { setExpression((s) => s.startsWith('-') ? s.slice(1) : `-${s}`); return }
    if (value === 'equals') { calculate(); return }
    if (key === 'n!') { insert('!'); return }
    insert(value)
  }
  function runSolver() {
    try {
      const input = solverInput.trim()
      if (!input) throw new Error('Type an expression or equation first.')
      if (input.includes('=')) {
        const solved = solveEquation(input)
        const resultText = solved.solutions.map((v) => `${solved.variable} = ${v}`).join(', ')
        const steps = equationSteps(input, solved.variable, solved.solutions)
        setSolution({ input, result: resultText, steps, kind: 'equation' })
        pushHistory(input, resultText)
      } else {
        const result = evaluateExpression(input, angleMode)
        setSolution({ input, result: fmt(result), steps: makeSteps(input, result, angleMode), kind: 'expression' })
        pushHistory(input, result)
      }
    } catch (e) { setSolution({ input: solverInput, error: e.message, steps: [], kind: 'error' }) }
  }
  async function readProblemImage(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) { setSolution({ error: 'Please choose an image file.', steps: [] }); return }
    setPhotoPreview(URL.createObjectURL(file))
    setOcrBusy(true); setOcrProgress(0); setSolution(null)
    let worker
    try {
      worker = await createWorker('eng', 1, { logger: (m) => { if (m.status === 'recognizing text') setOcrProgress(Math.round((m.progress || 0) * 100)) } })
      const { data } = await worker.recognize(file)
      const recognized = data.text
        .replace(/×/g, '*')
        .replace(/[÷]/g, '/')
        .replace(/[−–—]/g, '-')
        .replace(/[“”]/g, '"')
        .split('\n').map(line => line.trim()).filter(Boolean).join('\n')
        .replace(/[^0-9a-zA-ZπΠ√().,+\-*/^%=!\s]/g, '')
      if (!recognized.trim()) throw new Error('No readable math text was found. Try a clearer, well-lit picture.')
      setSolverInput(recognized.trim())
      setSolution({ input: recognized.trim(), notice: 'Text recognized from your image. Review it, then check the worked solution below.', result: '', steps: [], kind: 'recognized' })
      setTimeout(() => {
        try {
          const input = recognized.trim()
          if (input.includes('=')) {
            const solved = solveEquation(input)
            const resultText = solved.solutions.map(v => `${solved.variable} = ${v}`).join(', ')
            setSolution({ input, result: resultText, steps: equationSteps(input, solved.variable, solved.solutions), kind: 'equation' })
            pushHistory(input, resultText)
          } else {
            const result = evaluateExpression(input, angleMode)
            setSolution({ input, result: fmt(result), steps: makeSteps(input, result, angleMode), kind: 'expression' })
            pushHistory(input, result)
          }
        } catch (e) { setSolution({ input, error: `The text was recognized, but it could not be solved: ${e.message}`, steps: [], kind: 'error' }) }
      }, 0)
    } catch (e) {
      setSolution({ error: e.message || 'Could not read this image. Please try another photo.', steps: [], kind: 'error' })
    } finally {
      if (worker) await worker.terminate()
      setOcrBusy(false)
    }
  }

  function useHistory(item) { setExpression(item.expr); setActiveTab('calculator'); setShowHistory(false) }
  function copyAnswer() {
    if (!navigator.clipboard?.writeText) return
    navigator.clipboard.writeText(solution?.result || answer).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1300) }).catch(() => {})
  }

  return <div className={dark ? 'app dark' : 'app light'}>
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sigma size={22}/></div><span>calcora<span className="brand-dot">.</span></span></div>
      <div className="side-label">WORKSPACE</div>
      <button className={`nav-item ${activeTab === 'calculator' ? 'active' : ''}`} onClick={() => setActiveTab('calculator')}><FunctionSquare size={18}/> Calculator <span className="nav-shortcut">⌘ 1</span></button>
      <button className={`nav-item ${activeTab === 'solver' ? 'active' : ''}`} onClick={() => setActiveTab('solver')}><Sparkles size={18}/> Smart solver <span className="new-tag">NEW</span></button>
      <button className="nav-item" onClick={() => setShowHistory(true)}><History size={18}/> History</button>
      <div className="sidebar-bottom">
        <div className="side-label">PREFERENCES</div>
        <button className="nav-item" onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}><Settings2 size={18}/> Angle mode <span className="nav-shortcut">{angleMode}</span></button>
        <button className="nav-item" onClick={() => setDark(!dark)}>{dark ? <Sun size={18}/> : <Moon size={18}/>} Appearance <span className="nav-shortcut">{dark ? 'Dark' : 'Light'}</span></button>
        <div className="profile-card"><div className="avatar">C</div><div><b>Calcora</b><small>Personal workspace</small></div><MoreHorizontal size={18} className="muted"/></div>
      </div>
    </aside>

    <main className="main">
      <header className="topbar">
        <div className="breadcrumb"><span>Workspace</span><span className="crumb-slash">/</span><b>{activeTab === 'calculator' ? 'Calculator' : 'Smart solver'}</b></div>
        <div className="top-actions"><span className="status"><i/> All systems operational</span><button className="icon-btn" title="Calculation history" onClick={() => setShowHistory(true)}><Clock3 size={18}/></button><button className="avatar small-avatar">C</button></div>
      </header>

      <div className="content">
        <section className="page-heading">
          <div><div className="eyebrow"><span className="eyebrow-line"/> YOUR MATHEMATICAL WORKSPACE</div><h1>{activeTab === 'calculator' ? <>Numbers, <em>made simple.</em></> : <>Solve smarter. <em>Understand more.</em></>}</h1><p>{activeTab === 'calculator' ? 'A powerful calculator for everyday math and everything beyond.' : 'Explore expressions and equations with clear, guided explanations.'}</p></div>
          <div className="heading-chip"><Activity size={15}/> Precision mode <span className="chip-dot"/></div>
        </section>

        {activeTab === 'calculator' ? <div className="workspace-grid">
          <section className="calculator-card panel">
            <div className="panel-head"><div className="panel-title"><div className="title-icon"><FunctionSquare size={17}/></div><div><b>Calculator</b><small>Standard & scientific</small></div></div><div className="panel-tools"><button className={`mode-pill ${angleMode === 'DEG' ? 'selected' : ''}`} onClick={() => setAngleMode('DEG')}>DEG</button><button className={`mode-pill ${angleMode === 'RAD' ? 'selected' : ''}`} onClick={() => setAngleMode('RAD')}>RAD</button><button className="icon-btn subtle" onClick={() => setExpression('0')} title="Reset"><RotateCcw size={15}/></button></div></div>
            <div className="display">
              <div className="display-label">CURRENT EXPRESSION <span>LIVE PREVIEW</span></div>
              <div className="expression" title={expression}>{expression}</div>
              <div className="result-row"><span className="equals-sign">=</span><strong>{preview || answer}</strong><button className="copy-btn" onClick={copyAnswer}><Copy size={14}/></button></div>
            </div>
            <div className="scientific-head"><span><Sigma size={15}/> SCIENTIFIC FUNCTIONS</span><button onClick={() => setScientificOpen(!scientificOpen)}>{scientificOpen ? 'Collapse' : 'Expand'} <ChevronDown size={14} className={scientificOpen ? 'rotate' : ''}/></button></div>
            {scientificOpen && <div className="scientific-grid">{scientific.map(([label, value]) => <button key={label} className="sci-key" onClick={() => insert(value)}>{label}</button>)}</div>}
            <div className="keypad">{standard.map(([label, value]) => <button key={label} className={`key ${['÷','×','−','+'].includes(label) ? 'operator' : ''} ${label === 'AC' ? 'clear-key' : ''} ${label === '=' ? 'equals-key' : ''}`} onClick={() => pressKey(label, value)}>{label === '⌫' ? <Delete size={18}/> : label === '=' ? <Equal size={20}/> : label}</button>)}</div>
            <div className="keyboard-hint"><Keyboard size={13}/> Tip: You can type directly using your keyboard.</div>
          </section>

          <aside className="right-column">
            <section className="quick-card panel"><div className="quick-head"><div><span className="eyebrow">QUICK ACCESS</span><h3>Useful constants</h3></div><div className="quick-icon"><Lightbulb size={18}/></div></div><div className="constant-list">
              {[['π','Pi','3.14159265','pi'],['e','Euler’s number','2.71828182','e'],['√2','Square root of 2','1.41421356','sqrt(2)'],['φ','Golden ratio','1.61803398','1.6180339887']].map(([symbol,name,value,insertValue]) => <button className="constant-row" key={symbol} onClick={() => insert(insertValue)}><span className="constant-symbol">{symbol}</span><span className="constant-name"><b>{name}</b><small>{value}</small></span><ArrowUpRight size={15}/></button>)}
            </div></section>
            <section className="tip-card"><div className="tip-spark"><Sparkles size={17}/></div><div><b>A little math magic</b><p>Use the Smart Solver to break down an expression or solve an equation step by step.</p><button onClick={() => setActiveTab('solver')}>Try smart solver <ArrowUpRight size={14}/></button></div></section>
            <section className="recent-card panel"><div className="recent-head"><h3>Recent calculations</h3><button onClick={() => setShowHistory(true)}>View all <ArrowUpRight size={14}/></button></div>{history.slice(0,3).length ? history.slice(0,3).map((item) => <button className="recent-row" key={item.id} onClick={() => useHistory(item)}><span><small>{item.expr}</small><b>{item.result}</b></span><span className="recent-time">{item.time}</span></button>) : <div className="empty-recent">Your calculations will appear here.</div>}</section>
          </aside>
        </div> : <div className="solver-layout">
          <section className="solver-card panel"><div className="solver-title"><div className="title-icon purple"><Sparkles size={18}/></div><div><b>Smart math solver</b><small>Expressions, equations, and more</small></div><span className="solver-badge">BETA</span></div>
            <label className="field-label" htmlFor="solver">ENTER YOUR PROBLEM</label><textarea id="solver" value={solverInput} onChange={(e) => setSolverInput(e.target.value)} placeholder={'Try something like:\n(24 × 5) + 18 ÷ 3\n2x + 4 = 10\nx^2 - 5x + 6 = 0'} />
            <div className="photo-upload"><label className="photo-drop" htmlFor="problem-photo"><span className="photo-icon"><BookOpen size={18}/></span><span><b>Scan a math problem</b><small>Take a photo or upload an image · JPG, PNG, WEBP</small></span><span className="photo-action">Choose image</span></label><input id="problem-photo" type="file" accept="image/*" capture="environment" onChange={(e) => readProblemImage(e.target.files?.[0])} />{photoPreview && <img className="photo-preview" src={photoPreview} alt="Uploaded math problem" />}{ocrBusy && <div className="ocr-progress"><span>Reading image… {ocrProgress}%</span><div><i style={{ width: `${ocrProgress}%` }}/></div></div>}</div>
            <div className="solver-controls"><span><CircleHelp size={14}/> Supports arithmetic and single-variable equations</span><button className="solve-btn" onClick={runSolver}><Sparkles size={16}/> Solve problem</button></div>
            <div className="examples"><span>TRY AN EXAMPLE</span>{['(24 × 5) + 18 ÷ 3','2x + 4 = 10','x^2 - 5x + 6 = 0','sin(30) + cos(60)'].map((ex) => <button key={ex} onClick={() => setSolverInput(ex)}>{ex}</button>)}</div>
          </section>
          <section className="solution-card panel"><div className="solution-head"><div><span className="eyebrow">YOUR SOLUTION</span><h3>Worked answer</h3></div><div className="solution-icon"><BookOpen size={18}/></div></div>
            {!solution ? <div className="solution-empty"><div className="empty-orbit"><Sigma size={30}/></div><b>Your worked solution will appear here</b><p>Type a problem or scan a photo to see each calculation and algebra step in order.</p></div> : solution.error ? <div className="error-state"><CircleHelp size={22}/><b>Couldn't solve that</b><p>{solution.error}</p></div> : <div className="solution-content"><div className="problem-chip">{solution.input}</div><div className="answer-block"><span>FINAL ANSWER</span><strong>{solution.result}</strong><button onClick={copyAnswer}>{copied ? <Check size={15}/> : <Copy size={15}/>} {copied ? 'Copied' : 'Copy answer'}</button></div><div className="steps-heading"><span> <BookOpen size={15}/> STEP-BY-STEP</span><span>{solution.steps.length} steps</span></div><ol className="steps-list">{solution.steps.map((step,i) => <li key={i} className={step.final ? 'final-step' : ''}><span>{String(i+1).padStart(2,'0')}</span><div><small>{step.label}</small><code>{step.equation}</code></div></li>)}</ol><div className="explain-note"><Lightbulb size={15}/> Check the recognized equation against your photo, especially if it contains handwritten symbols.</div></div>}
          </section>
        </div>}
        <footer className="footer"><span>© 2026 Calcora. Made for curious minds.</span><span><i/> Built for clarity and precision</span></footer>
      </div>
    </main>

    {showHistory && <div className="overlay" onClick={() => setShowHistory(false)}><aside className="history-drawer" onClick={(e) => e.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">YOUR WORKSPACE</span><h2>Calculation history</h2></div><button className="icon-btn" onClick={() => setShowHistory(false)}><X size={18}/></button></div><div className="drawer-actions"><span>{history.length} saved in this session</span><button onClick={() => setHistory([])} disabled={!history.length}><Trash2 size={14}/> Clear history</button></div>{history.length ? <div className="history-list">{history.map((item) => <button className="history-item" key={item.id} onClick={() => useHistory(item)}><div><small>{item.time}</small><b>{item.expr}</b></div><strong>{item.result}</strong></button>)}</div> : <div className="history-empty"><Clock3 size={28}/><b>No calculations yet</b><p>Your recent calculations will be saved here while this tab is open.</p></div>}</aside></div>}
  </div>
}

export default App
