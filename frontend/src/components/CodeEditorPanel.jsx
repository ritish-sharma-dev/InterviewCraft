import Editor from "@monaco-editor/react";
import { Loader2Icon, PlayIcon } from "lucide-react";
import { LANGUAGE_CONFIG } from "../data/problems";
import "../styles/components.css";

function CodeEditorPanel({
  selectedLanguage,
  code,
  isRunning,
  onLanguageChange,
  onCodeChange,
  onRunCode,
  readOnly = false,
}) {
  return (
    <section className="editor">
      <div className="editor__toolbar">
        <div className="editor__languages">
          {readOnly && <span className="editor__live-label">Candidate code · live</span>}
          <img
            src={LANGUAGE_CONFIG[selectedLanguage].icon}
            alt={LANGUAGE_CONFIG[selectedLanguage].name}
            className="editor__language-icon"
          />
          <select
            className="form-select form-select--compact"
            value={selectedLanguage}
            onChange={onLanguageChange}
            disabled={readOnly}
          >
            {Object.entries(LANGUAGE_CONFIG).map(([key, lang]) => (
              <option key={key} value={key}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button className="app-button app-button--primary app-button--small" disabled={isRunning} onClick={onRunCode}>
          {isRunning ? (
            <>
              <Loader2Icon className="app-icon app-icon--small app-icon--spinning" />
              Running...
            </>
          ) : (
            <>
              <PlayIcon className="app-icon app-icon--small" />
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="editor__code">
        <Editor
          height={"100%"}
          language={LANGUAGE_CONFIG[selectedLanguage].monacoLang}
          value={code}
          onChange={onCodeChange}
          theme="vs-dark"
          options={{
            fontSize: 16,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            minimap: { enabled: false },
            readOnly,
          }}
        />
      </div>
    </section>
  );
}
export default CodeEditorPanel;
