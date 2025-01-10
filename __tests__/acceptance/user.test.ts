import app from "../../src/app";
import { PORT } from "../../src/config";
import { AppDataSource } from "../../src/data-source";
import * as request from "supertest";

let connection, server;
const testUser = { firstName: "John", lastName: "Doe", age: 30 };

beforeEach(async () => {
  connection = await AppDataSource.initialize();
  // ! Caution! This will drop all tables
  await connection.synchronize(true);

  server = app.listen(PORT);
});

afterEach(() => {
  connection.destroy();
  server.close();
});

it("should be no users initially", async () => {
  const response = await request(app).get("/users");
  expect(response.status).toBe(200);
  expect(response.body.length).toBe(0);
});

it("should create a new user", async () => {
  const response = await request(app).post("/users").send(testUser);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ ...testUser, id: 1 });
});

it("should not create a new user if no firstName given", async () => {
  const { firstName, ...rest } = testUser;
  const response = await request(app).post("/users").send(rest);
  expect(response.status).toBe(400);
  expect(response.body.errors).not.toBeNull();
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0]).toEqual({
    location: "body",
    msg: "Invalid value",
    path: "firstName",
    type: "field"
  });
});

it("should not create a new user if age is less than 0", async () => {
  const { age, ...rest } = testUser;
  const response = await request(app)
    .post("/users")
    .send({ ...rest, age: -1 });
  expect(response.status).toBe(400);
  expect(response.body.errors).not.toBeNull();
  expect(response.body.errors.length).toBe(1);
  expect(response.body.errors[0]).toEqual({
    location: "body",
    msg: "Age must be greater than 0",
    path: "age",
    type: "field",
    value: -1
  });
});
