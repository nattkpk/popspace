const scenarios = require('./mercury_server_scenarios')

tlib.TestTemplate.describeWithLib('mercury_server', () => {
  jest.setTimeout(30000)

  test("starts up and shuts down gracefully", async () => {
    await scenarios["restarts_correclty"]()
    expect(true)
  })

  test("allows a connection", async () => {
    const connectedClients = await scenarios["keep_track_of_clients"]()
    expect(connectedClients.clientsCountOnServer).toEqual(connectedClients.clientsCreated)
  })

  test("refuses to connect without authorized access", async () => {
    const result = await scenarios["refuse_unauthorized_entry"]()
    expect(result.kind).toEqual("error")
    expect(result.code).toEqual("AUTH_FAILED")
  })

  test("disconnects clients when they fail their heartbeat timeout", async () => {
    const result = await scenarios["heartbeat_timeout_disconnect"]()
    expect(result.clientsAfterTimeout).toEqual(result.clientsBeforeTimeout - 1)
  })

})
