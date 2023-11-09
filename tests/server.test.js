const server = require('../server');
const request = require("supertest");

beforeAll(async() => {
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
});

test('wrong path test', () => {
    request(server).get('/bibochka').expect(404);
}, 5000);

test('delete friend as self test', async () => {
    const response = await request(server)
        .post('/delete_friend')
        .send({user_id: 7, friend_id: 7})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

    const data = JSON.parse(response.text);
    expect(data.success).toBe(false);
});

test('no user with email test', async () => {
    const response = await request(server)
        .post('/auth')
        .send({email: "nosuchemail", password: "12344"})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

    const data = JSON.parse(response.text);
    expect(data.reason).toEqual('Нет пользователя с таким email');
});

afterAll(async() => {
    server.close();
})