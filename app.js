const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const http = require('http');
const WebSocket = require('ws');
const multer = require('multer');
const path = require('path');
const pool = require('./config/pool_de_conexao'); // Conexão com o banco de dados
const communityRoutes = require('./app/routes/router');
const postRoutes = require('./app/routes/router');
const commentRoutes = require('./app/routes/router');

require('dotenv').config(); // Carregar variáveis de ambiente
//const routerConsultas = require('./app/routes/consultas'); // Certifique-se de que o caminho está correto
//const routerPlanos = require('./app/routes/planos'); 
const app = express();
const rotas = require('./app/routes/router');
// Associa o router ao caminho /chat
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 3000;
// Configuração do MySQLStore para sessões
const activeConnections = new Map();

// **Configuração do trust proxy** (Render usa HTTPS por padrão)
app.set('trust proxy', 1);

// **Configuração do MySQLStore**
let sessionStore = new MySQLStore(
  {
      expiration: 1800000,  // 30 minutos
      checkExpirationInterval: 300000,  // Verifica sessões expiradas a cada 5 minutos
      endConnectionOnClose: true,  // Fecha conexões após o encerramento
  },
  pool
);
app.get('/chat', (req, res) => {
  const usuarioId = req.session?.userId || "defaultUserId"; // Substitua com a lógica correta
  res.render('partial/chat', { usuarioId });
});

app.use('/api/communities', communityRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
//app.use('/consultas', routerConsultas);
//app.use('/planos', routerPlanos);
// **Configuração do middleware de sessão**
// Configuração do middleware de sessão
app.use(
  session({
    key: 'user_session',
    secret: 'pudimcombolodecenoura',
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    },
  })
);

app.use((req, res, next) => {
  if (!req.session.autenticado) {
    req.session.autenticado = null; // Inicializa como null caso não esteja definido
  }
  res.locals.autenticado = req.session.autenticado;
  res.locals.usuarioNome = req.session.autenticado?.usuarioNome || null;
  next();
});
// **Parsing do corpo das requisições**
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', rotas);

function verificarAutenticacao(req, res, next) {
  if (req.session?.autenticado) {
    return next(); // Usuário autenticado, continue
  }
  res.redirect('/loginpacientes'); // Redirecione para a página de login
}

app.use((req, res, next) => {
  res.locals.usuarioNome = req.session.autenticado ? req.session.autenticado.usuarioNome : null;
  next();
});

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// **Middleware para arquivos estáticos**
app.use(express.static(path.join(__dirname, 'app/public')));

// **Configuração da view engine EJS**
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'));

app.post('/api/denunciar', async (req, res) => {
  const { nomeDenunciante, nomeDenunciado, motivoDenuncia, textoDenuncia } = req.body;
  const usuarioId = req.session?.autenticado?.usuarioId;
  if (!usuarioId) {
    return res.status(403).json({ error: 'Usuário não autenticado.' });
  }  


  try {
      await pool.query(`
          INSERT INTO denuncia (ID_USUARIO, NOME_DENUNCIADO, TEXTO_DENUNCIA, NOME_DENUNCIANTE) 
          VALUES (?, ?, ?, ?)`, 
          [usuarioId, nomeDenunciado, textoDenuncia, nomeDenunciante]
      );

      res.status(201).json({ message: 'Denúncia registrada com sucesso!' });
  } catch (error) {
      console.error("Erro ao registrar denúncia:", error);
      res.status(500).json({ error: 'Erro ao registrar a denúncia.' });
  }
});
// **Parsing do corpo das requisições**
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// **Configuração do Multer para upload de arquivos**
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Certifique-se de que esta pasta existe
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// Filtro para aceitar apenas imagens e documentos
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
  } else {
      cb(new Error('Tipo de arquivo não permitido'), false);
  }
};

// Limite de tamanho do arquivo (5 MB neste exemplo)

app.post('/api/banir', async (req, res) => {
  const { nomeUsuario } = req.body;

  try {
    // Buscando o ID do usuário pelo nome
    const [usuario] = await pool.query(
      `SELECT ID_USUARIO FROM usuario WHERE NOME_USUARIO = ?`, 
      [nomeUsuario]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    const usuarioId = usuario[0].ID_USUARIO;

    // Atualizando o status do usuário para banido (ajustar conforme sua lógica de banimento)
    await pool.query(
      `UPDATE usuario SET DIFERENCIACAO_USUARIO = 'Banido' WHERE ID_USUARIO = ?`, 
      [usuarioId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao banir usuário:", error);
    res.status(500).json({ success: false, message: 'Erro ao banir usuário.' });
  }
});

// Atualizar as rotas do chat
app.get('/chat', verificarAutenticacao, async (req, res) => {
  try {
    const [sessoesChatAtivas] = await pool.query(`
      SELECT DISTINCT
          c.ID_CONSULTAS as consultaId,
          u.NOME_USUARIO as psicologoNome,
          u.AVATAR_USUARIO as psicologoAvatar,
          (SELECT MENSAGEM_CHAT 
           FROM chat 
           WHERE ID_CONSULTA = c.ID_CONSULTAS 
           ORDER BY DATA_HORA_CHAT DESC 
           LIMIT 1) as ultimaMensagem,
          c.DATAHORA_CONSULTAS as ultimaAtualizacao
      FROM consultas c
      JOIN usuario u ON (
          CASE 
              WHEN c.USUARIO_ID_USUARIO = ? THEN c.PSICOLOGO_ID_PSICOLOGO = u.ID_USUARIO
              ELSE c.USUARIO_ID_USUARIO = u.ID_USUARIO
          END
      )
      WHERE (c.USUARIO_ID_USUARIO = ? OR c.PSICOLOGO_ID_PSICOLOGO = ?)
      AND c.STATUS_CONSULTAS = 'Agendada'
    `, [req.session?.autenticado?.usuarioId, req.session?.autenticado?.usuarioId, req.session?.autenticado?.usuarioId]);

    res.render('pages/index', {
      pagina: 'chat',
      autenticado: req.session.autenticado,
      sessoesChatAtivas,
    });
  } catch (error) {
    console.error('Erro ao carregar chat:', error);
    res.status(500).render('pages/index', {
      pagina: 'chat',
      autenticado: req.session.autenticado,
      error: 'Erro ao carregar sessões de chat.',
    });
  }
});
app.use((req, res, next) => {
  if (req.session && req.session.message) {
    res.locals.message = req.session.message; // Transfere para o escopo local das views
    delete req.session.message; // Remove para evitar mensagens persistentes
  } else {
    res.locals.message = null; // Define como nulo se não existir
  }
  next();
});
app.get('/api/usuario/cpf/:cpf', async (req, res) => {
  const cpf = req.params.cpf; // Pega o CPF dos parâmetros da URL
  
  if (!cpf) {
    return res.status(400).json({ error: 'CPF não fornecido' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT ID_USUARIO FROM usuario WHERE CPF_USUARIO = ?',
      [cpf]
    );

    if (rows.length > 0) {
      return res.status(200).json({ idUsuario: rows[0].ID_USUARIO });
    } else {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    console.error('Erro ao consultar o banco de dados:', error);
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
});
app.post('/api/consultas', async (req, res) => {
  const usuarioId = req.session?.autenticado?.usuarioId; // Garante que usuarioId seja acessado com segurança
  if (!usuarioId) {
    return res.status(403).json({ error: 'Usuário não autenticado.' });
  }

  const { dataHora, status, preferencias, valor, tempo, anotacoes, psicologoId } = req.body;

  try {
    await pool.query(`
      INSERT INTO consultas (DATAHORA_CONSULTAS, STATUS_CONSULTAS, PREFERENCIAS_REMOTAS_CONSULTAS, 
                             VALOR_CONSULTA, TEMPO_CONSULTA, ANOTACOES_CONSULTAS, 
                             USUARIO_ID_USUARIO, PSICOLOGO_ID_PSICOLOGO)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [dataHora, status, preferencias, valor, tempo, anotacoes, usuarioId, psicologoId]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao inserir consulta:', error);
    res.status(500).json({ success: false, message: 'Erro ao agendar consulta.' });
  }
});

// WebSocket - Configuração de mensagens
wss.on('connection', (ws, req) => {
  console.log('Nova conexão WebSocket estabelecida');

  ws.isAlive = true;
  ws.on('pong', () => {
      ws.isAlive = true;
  });

  ws.on('message', async (message) => {
      try {
          const data = JSON.parse(message);
          console.log('Mensagem recebida:', data);

          switch (data.type) {
              case 'join':
                  // Armazenar informações da conexão
                  ws.consultaId = data.consultaId;
                  ws.usuarioId = data.usuarioId;
                  
                  // Armazenar a conexão no mapa
                  if (!activeConnections.has(data.consultaId)) {
                      activeConnections.set(data.consultaId, new Set());
                  }
                  activeConnections.get(data.consultaId).add(ws);
                  
                  console.log(`Usuário ${data.usuarioId} entrou na consulta ${data.consultaId}`);
                  break;

              case 'nova_mensagem':
                  // Broadcast para todos os clientes na mesma consulta
                  const connections = activeConnections.get(data.consultaId) || new Set();
                  connections.forEach(client => {
                      if (client.readyState === WebSocket.OPEN) {
                          client.send(JSON.stringify({
                              type: 'nova_mensagem',
                              consultaId: data.consultaId,
                              mensagem: data.mensagem
                          }));
                      }
                  });
                  break;
              case 'novo_arquivo':
                      // Broadcast de um novo arquivo enviado
                      const arquivoConnections = activeConnections.get(data.consultaId) || new Set();
                      arquivoConnections.forEach(client => {
                          if (client.readyState === WebSocket.OPEN) {
                              client.send(JSON.stringify({
                                  type: 'novo_arquivo',
                                  consultaId: data.consultaId,
                                  arquivo: data.arquivo
                              }));
                          }
                      });
                      break;
          }
      } catch (error) {
          console.error('Erro ao processar mensagem:', error);
      }
  });

  ws.on('close', () => {
      // Remover conexão quando fechada
      if (ws.consultaId && activeConnections.has(ws.consultaId)) {
          activeConnections.get(ws.consultaId).delete(ws);
          if (activeConnections.get(ws.consultaId).size === 0) {
              activeConnections.delete(ws.consultaId);
          }
      }
      console.log('Conexão WebSocket fechada');
  });
});
app.post('/api/upload', upload.single('arquivo'), async (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
  }

  const { consultaId, remetenteId } = req.body;

  try {
      // Adicionar logs para debug
      console.log('File:', req.file);
      console.log('Body:', req.body);

      // Verificar se consultaId e remetenteId existem
      if (!consultaId || !remetenteId) {
          return res.status(400).json({ 
              error: 'consultaId e remetenteId são obrigatórios',
              receivedData: { consultaId, remetenteId }
          });
      }

      // Salvar no banco de dados
      await pool.query(`
          INSERT INTO chat (ID_CONSULTA, ID_REMETENTE, MENSAGEM_CHAT, DOCUMENTOS_CHAT, DATA_HORA_CHAT) 
          VALUES (?, ?, ?, ?, NOW())
      `, [consultaId, remetenteId, '', req.file.filename]);

      // Broadcast para WebSocket
      const connections = activeConnections.get(consultaId) || new Set();
      connections.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                  type: 'novo_arquivo',
                  consultaId: consultaId,
                  remetenteId: remetenteId,
                  arquivo: req.file.filename
              }));
          }
      });

      res.status(200).json({ 
          success: true, 
          arquivo: req.file.filename,
          path: `/uploads/${req.file.filename}` // Adicionar o caminho do arquivo na resposta
      });
  } catch (error) {
      console.error('Erro detalhado ao salvar arquivo:', error);
      res.status(500).json({ 
          success: false, 
          error: 'Erro ao salvar arquivo',
          details: error.message 
      });
  }
});

// Adicione esta rota para servir os arquivos
app.use('/uploads', express.static('uploads'));
// Verificar conexões inativas a cada 30 segundos
const interval = setInterval(() => {
  wss.clients.forEach(ws => {
      if (ws.isAlive === false) {
          return ws.terminate();
      }
      ws.isAlive = false;
      ws.ping();
  });
}, 30000);

wss.on('close', () => {
  clearInterval(interval);
});
app.post('/enviar-mensagem', async (req, res) => {
  const { consultaId, conteudo, remetenteId } = req.body;
  
  try {
      await pool.query(`
          INSERT INTO chat (ID_CONSULTA, ID_REMETENTE, MENSAGEM_CHAT, DATA_HORA_CHAT) 
          VALUES (?, ?, ?, NOW())
      `, [consultaId, remetenteId, conteudo]);
      
      res.status(200).json({ success: true });
  } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      res.status(500).json({ success: false, error: 'Erro ao salvar mensagem' });
  }
});
// **Verificar e encerrar conexões inativas a cada 30 segundos**
setInterval(() => {
  wss.clients.forEach((ws) => {
    if (!ws.isAlive) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

// **Inicializar o servidor**
server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}\nhttp://localhost:${port}`);
});
