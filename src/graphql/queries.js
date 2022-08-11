/* eslint-disable */
// this is an auto generated file. This will be overwritten

<<<<<<< HEAD
export const getTodo = /* GraphQL */ `
  query GetTodo($id: ID!) {
    getTodo(id: $id) {
=======
export const getTodo2 = /* GraphQL */ `
  query GetTodo2($id: ID!) {
    getTodo2(id: $id) {
>>>>>>> develop
      id
      name
      description
      createdAt
      updatedAt
    }
  }
`;
<<<<<<< HEAD
export const listTodos = /* GraphQL */ `
  query ListTodos(
    $filter: ModelTodoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodos(filter: $filter, limit: $limit, nextToken: $nextToken) {
=======
export const listTodo2s = /* GraphQL */ `
  query ListTodo2s(
    $filter: ModelTodo2FilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTodo2s(filter: $filter, limit: $limit, nextToken: $nextToken) {
>>>>>>> develop
      items {
        id
        name
        description
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
