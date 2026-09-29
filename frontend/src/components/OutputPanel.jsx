import "../styles/components.css";

function OutputPanel({ output }) {
  return (
    <section className="output-panel">
      <div className="output-panel__heading">
        Output
      </div>
      <div className="output-panel__content">
        {output === null ? (
          <p className="output-panel__placeholder">Click "Run Code" to see the output here...</p>
        ) : output.success ? (
          <pre className="output-panel__result">{output.output}</pre>
        ) : (
          <div>
            {output.output && (
              <pre className="output-panel__result output-panel__result--partial">
                {output.output}
              </pre>
            )}
            <pre className="output-panel__error">{output.error}</pre>
          </div>
        )}
      </div>
    </section>
  );
}
export default OutputPanel;
