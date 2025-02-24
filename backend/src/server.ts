import app from './app';

app.listen(3333, '0.0.0.0', () => {
    console.log('Servidor rodando na porta 3333 e acessível externamente');
});