/* global describe it before */

const http = require('http')
const appServer = http.createServer(require('../server.js').app)
const mongo = require('../server.js').db
const supertest = require('supertest')
const should = require('should')
const expect = require('chai').expect
const assert = require('assert')
const faker = require('faker')
const server = supertest(appServer)

const UserModel = require('../app/models/users')
const MeetupsModel = require('../app/models/meetups')
const MembersModel = require('../app/models/members')

before((done) => {
  UserModel.remove({}).exec()
  MeetupsModel.remove({}).exec()
  done()
})

describe('Default API', () => {
  it('GET /v1/ should return 404 page', (done) => {
    server
      .get('/v1')
      .expect('Content-type', /json/)
      .expect(404)
      .end((err, res) => {
        res.status.should.equal(404)
        done()
      })
  })

  it('GET /v1/status --> should return 200 OK', (done) => {
    server
      .get('/v1/status')
      .expect('Content-type', /text/)
      .expect(200)
      .end((err, res) => {
        res.text.should.equal('OK')
        done()
      })
  })
})

describe('User API', () => {
  it('POST /v1/users/register -> should return 201 CREATED', (done) => {
    const fullname = faker.name.findName()
    global.userPassword = faker.internet.password()

    const data = {
      email: faker.internet.email(),
      fullname: fullname,
      username: faker.internet.userName(fullname),
      password: userPassword
    }

    server
      .post('/v1/users/register')
      .expect('Content-type', /json/)
      .send(data)
      .end((err, res) => {
        res.status.should.equal(201)
        expect(res.body).is.an('object')
        res.body.email.should.equal(data.email.toLowerCase())
        res.body.should.have.property('hashed_password')
        res.body.hashed_password.should.not.equal(null)
        res.body.should.have.property('salt')

        global.currentUser = res.body
        done()
      })
  })

  it('GET /v1/users/:userId -> should return 200 OK', (done) => {
    const endpoint = `/v1/users/${currentUser._id}`

    server
      .get(endpoint)
      .expect('Content-type', /json/)
      .end((err, res) => {
        res.status.should.equal(200)
        expect(res.body).is.an('object')
        res.body.should.have.property('email')
        res.body.should.have.property('fullname')
        res.body.should.have.property('username')
        res.body.should.have.property('hashed_password')
        res.body.hashed_password.should.not.equal(null)
        res.body.should.have.property('salt')
        done()
      })
  })

  it('POST /v1/users/login -> should return 200 OK', (done) => {
    const endpoint = '/v1/users/login'
    const payloads = {
      email: currentUser.email,
      password: userPassword
    }

    server
      .post(endpoint)
      .send(payloads)
      .expect('Content-type', /json/)
      .end((err, res) => {
        res.status.should.equal(200)
        expect(res.body).is.an('object')
        res.body.should.have.property('email')
        res.body.should.have.property('fullname')
        res.body.should.have.property('username')
        done()
      })
  })

  it('POST /v1/users/login -> Wrong password 401 UNAUTHORIZED', (done) => {
    const endpoint = '/v1/users/login'
    const payloads = {
      email: currentUser.email,
      password: faker.internet.password()
    }

    server
      .post(endpoint)
      .send(payloads)
      .expect('Content-type', /json/)
      .end((err, res) => {
        expect(res.body).is.an('object')
        res.status.should.equal(401) // UNAUTHORIZED
        res.body.should.have.property('code')
        res.body.code.should.equal(401)
        res.body.should.have.property('message')
        done()
      })
  })

  it('PUT /v1/users/:userId -> should return 200', (done) => {
    // please make testing for API update user

    done()
  })

  it('DELETE /v1/users/:userId -> should return 204', (done) => {
    // please make testing for API remove user

    done()
  })
})

describe('Meetups API', () => {
  it('POST /v1/meetups/create -> should return 201 CREATED', (done) => {
    const data = {
      name: faker.lorem.words(),
      headline: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      logo_url: faker.image.image(),
      city: 'Jakarta',
      country: 'Indonesia'
    }

    server
      .post('/v1/meetups/create')
      .expect('Content-type', /json/)
      .send(data)
      .end((err, res) => {
        res.status.should.equal(201)
        expect(res.body).is.an('object')
        res.body.should.have.property('_id')
        res.body.should.have.property('slug')
        res.body.slug.should.not.equal(null)

        global.currentMeetup = res.body
        done()
      })
  })

  it('GET /v1/meetups/:meetupId -> should return 200', (done) => {
    // please make testing for API get single meetup group

    done()
  })

  it('PUT /v1/meetups/:meetupId -> should return 200', (done) => {
    // please make testing for API update meetup group

    done()
  })
})

after((done) => {
  done()
})
