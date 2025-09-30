import React, { useState, useMemo, useCallback } from 'react';
import './FileUpload.css'; 

// Constantes para os modos de envio
const MODE = {
  UPLOAD: 'upload',
  TEXT: 'text',
};

// Estado inicial para a resposta do backend
const INITIAL_RESPONSE_STATE = {
    classification: 'Aguardando envio de Arquivo',
    emailSubject: 'Aguardando envio de Arquivo',
    autoResponse: 'Aguardando envio de Arquivo',
    statusMessage: 'Aguardando envio de arquivo...',
    loading: false,
};

export default function FileUploadComponent() {
  // Controle de estado
  const [mode, setMode] = useState(MODE.UPLOAD); 
  const [inputText, setInputText] = useState(''); 
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Estado centralizado para a resposta e o loading
  const [response, setResponse] = useState(INITIAL_RESPONSE_STATE);

  const allowedTypes = useMemo(() => ['application/pdf', 'text/plain'], []);
  const API_ENDPOINT = '/classify_file'; // Usando o proxy do Vite

  // Função utilitária para atualizar o estado de resposta (Performance)
  const updateResponse = useCallback((updates) => {
    setResponse(prev => ({ ...prev, ...updates }));
  }, []); 

  // --- Funções de Estado e Reset (usando useCallback) ---
  
  const resetResults = useCallback(() => {
    updateResponse({
        classification: 'Aguardando envio de Arquivo',
        emailSubject: 'Aguardando envio de Arquivo',
        autoResponse: 'Aguardando envio de Arquivo',
    });
  }, [updateResponse]);
  
  const handleModeChange = useCallback((newMode) => {
      setMode(newMode);
      setFile(null); 
      setInputText('');
      resetResults();
  }, [resetResults, updateResponse]);

  // --- Handlers de Upload (usando useCallback) ---
  
  const handleFileChange = useCallback((event) => {
    const selectedFile = event.target.files[0];
    const isValidType = selectedFile && allowedTypes.includes(selectedFile.type);
    
    if (isValidType) {
      setFile(selectedFile);
      updateResponse({ statusMessage: `Arquivo ${selectedFile.name} selecionado.` });
      resetResults();
    } else {
      alert('Tipo de arquivo não permitido. Por favor, selecione um .pdf ou .txt.');
      setFile(null);
    }
  }, [allowedTypes, resetResults, updateResponse]);

  const handleDragEnter = useCallback((e) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDragOver = useCallback((e) => { e.preventDefault(); }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    const isValidType = droppedFile && allowedTypes.includes(droppedFile.type);

    if (isValidType) {
      setFile(droppedFile);
      updateResponse({ statusMessage: `Arquivo ${droppedFile.name} selecionado por arrasto.` });
      resetResults();
    } else {
      alert('Tipo de arquivo não permitido. Por favor, selecione um .pdf ou .txt.');
      setFile(null);
    }
  }, [allowedTypes, resetResults, updateResponse]);


  // --- Função de Envio (usando useCallback) ---
  const handleSubmit = useCallback(async () => {
    const isUploadValid = mode === MODE.UPLOAD && file;
    const isTextValid = mode === MODE.TEXT && inputText.trim().length >= 5;

    if (!isUploadValid && !isTextValid) {
      alert(mode === MODE.UPLOAD ? 'Por favor, selecione um arquivo.' : 'Digite pelo menos 5 caracteres para análise.');
      return;
    }

    // 1. Define estados de carregamento e processamento
    updateResponse({ 
        loading: true, 
        statusMessage: `Conectando-se à API...`,
        classification: 'Processando...',
        emailSubject: 'Aguardando resposta...',
        autoResponse: 'Aguardando resposta...',
    });

    const formData = new FormData();

    // 2. Criação do FormData
    if (mode === MODE.UPLOAD) {
      formData.append('file', file); 
    } else if (mode === MODE.TEXT) {
      const textBlob = new Blob([inputText], { type: 'text/plain' });
      formData.append('file', textBlob, 'email_content.txt'); 
    } 

    try {
      const response = await fetch("https://email-api-classifier.onrender.com/classify_file", {
        method: 'POST',
        body: formData, 
      });

      if (response.ok) {
        const data = await response.json();
        const filename = mode === MODE.UPLOAD ? data.filename : "do email digitado";

        // 3. Sucesso: Atualiza o estado
        updateResponse({
            classification: data.classification || 'Não Classificado',
            emailSubject: data.email_subject || 'Assunto Não Encontrado',
            autoResponse: data.auto_response || 'Resposta Automática Padrão',
            statusMessage: `Sucesso! Conteúdo "${filename}" processado.`,
            loading: false,
        });

      } else {
        // 4. Erro HTTP
        const errorText = await response.text(); 
        updateResponse({
            statusMessage: `Erro HTTP (${response.status} - ${response.statusText}).`,
            classification: 'ERRO DE API',
            emailSubject: `Status: ${response.status}`,
            autoResponse: errorText.substring(0, 300) + '...',
            loading: false,
        });
      }

    } catch (error) {
      // 5. Erro de Rede/Conexão
      console.error('Erro fatal de rede:', error);
      updateResponse({
        statusMessage: `Erro de Conexão/Rede. Verifique se o backend está ativo.`,
        classification: 'ERRO DE CONEXÃO',
        emailSubject: 'Verifique se o backend está rodando.',
        autoResponse: `Detalhe do Erro: ${error.message}`,
        loading: false,
      });
    }
  }, [mode, file, inputText, updateResponse]);


  // --- Propriedades Derivadas (Clean Code) ---
  const dropzoneClass = `dropzone ${isDragging ? 'is-dragging' : ''}`;
  const isSubmitDisabled = response.loading || (mode === MODE.UPLOAD && !file) || (mode === MODE.TEXT && inputText.trim().length < 5);

  return (
    <div className="file-upload-container">
      <h2>Classificação de Email</h2>

      {/* Botões de Alternância de Modo */}
      <div className="mode-selector">
        <button 
            className={`mode-button ${mode === MODE.UPLOAD ? 'active' : ''}`}
            onClick={() => handleModeChange(MODE.UPLOAD)}
            disabled={response.loading}
        >
            Upload de Arquivo
        </button>
        <button 
            className={`mode-button ${mode === MODE.TEXT ? 'active' : ''}`}
            onClick={() => handleModeChange(MODE.TEXT)}
            disabled={response.loading}
        >
            Inserir Texto
        </button>
      </div>

      {/* --- ÁREA CONDICIONAL CENTRAL (TAMANHO PADRONIZADO) --- */}
      
      {mode === MODE.UPLOAD ? (
        // Modo Upload
        <div className="input-content-box">
          <div
            className={dropzoneClass}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-input').click()}
          >
            <p>
              {isDragging
                ? 'Solte o arquivo aqui...'
                : 'Arraste e solte o arquivo (.pdf ou .txt) ou clique para selecionar'}
            </p>
            <input
              id="file-input"
              type="file"
              accept=".pdf,text/plain"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
          {file && (
            <div className="file-info">
              <p>
                Arquivo Selecionado: <strong>{file.name}</strong> ({
                  (file.size / 1024 ).toFixed(2)
                }{' '}KB)
              </p>
            </div>
          )}
        </div>
      ) : (
        // Modo Inserção de Texto
        <div className="text-input-area input-content-box">
            <textarea
                placeholder="Cole o texto do e-mail ou documento grande aqui para análise..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows="1" // Usamos rows=1 e o CSS fará o crescimento
                disabled={response.loading}
            ></textarea>
            <p>Caracteres: {inputText.length}</p>
        </div>
      )}
      {/* --- FIM ÁREA CONDICIONAL --- */}

      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
      >
        {response.loading ? 'Analisando...' : 'Enviar para Análise'}
      </button>

      {/* Área de Resposta do Backend */}
      <h3 className="response-area-label">Status: {response.statusMessage}</h3>
      
      <div className="response-group-row">
        <div className="response-card classification-card">
            <h4>Classificação:</h4>
            <p><strong>{response.classification}</strong></p>
        </div>
        <div className="response-card subject-card">
            <h4>Assunto Sugerido:</h4>
            <p><strong>{response.emailSubject}</strong></p>
        </div>
      </div>
      
      <div className="response-area">
        <h4 style={{marginTop: 0}}>Resposta Automática:</h4>
        <pre>{response.autoResponse}</pre>
      </div>
    </div>
  );
}