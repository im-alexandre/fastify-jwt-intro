const fastify = require('fastify')()
const jwt = require('fastify-jwt');

fastify.register(jwt, {
  secret: 'key',
  cookie: { 
    cookieName: 'token'
  }
});

fastify
  .register(require('fastify-cookie'));

fastify.get('/cookies', async (request, reply) => {
  const token = await reply.jwtSign({
    name: 'foo',
    role: ['admin', 'spy']
  });
      reply
    .setCookie('token', token, {
      domain: '',
      path: '/',
      //secure: true,
      httpOnly: true,
      sameSite: true
    })
    .code(200)
    .send('Cookie sent')
});
fastify.get('/verifycookie', async (request, reply) => {
  try {
    await request.jwtVerify()
    //reply.send({ code: 'OK', message: 'it works!' })
    reply.send(request.user)
  }
  catch(error){
    reply.send(error);
  }
});
fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`server listening on ${address}`)
})
