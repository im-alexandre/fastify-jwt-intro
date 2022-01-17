const fastify = require('fastify')({
  logger: true
})

// Protegendo todas as rotas da aplicação
fastify.register(require('fastify-jwt'), {
  // Chave para criação dos tokens (pode ser um arquivo, string ou função)
  secret: 'secret'
});

fastify.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
  .after(() => {
    fastify.route({
      method: 'GET',
      url: '/secret',
      preHandler: [fastify.authenticate],
      handler: (req, reply) => {
        reply.send('secret')
      }
    })
  });

fastify.post('/signup', (req, reply) => {
  const token = fastify.jwt.sign({
    foo: 'bar'
  })
  reply.send({
    token
  })
});

fastify.listen(3000, function(err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
