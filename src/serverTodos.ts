import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'

// Sample Data
const usersArr = [
  { id: "1", firstname: "John", lastname: "Smith", age: 25 },
  { id: "2", firstname: "Jane", lastname: "Doe", age: 30 },
  { id: "3", firstname: "Joe", lastname: "Moe", age: 34 },
]

const todosArr = [
  { id: "1", task: "Wash laundry", completed: false, userId: "1" },
  { id: "2", task: "Feed salamander", completed: true, userId: "3" },
]

// GraphQL Type Definitions
const typeDefs = `#graphql
  type Query {
    hello: String,
    users: [User],
    todos: [Todo],
    userById(userId: ID): User
  }

  type User {
    id: ID,
    firstname: String,
    lastname: String,
    age: Int,
    todos: [Todo]
  }

  type Todo {
    id: ID,
    task: String,
    completed: Boolean,
    user: User
  }
`

// GraphQL Resolvers
const resolvers = {
  Query: {
    hello: () => "hello world!",
    users: () => usersArr,
    todos: () => todosArr,
    userById: (_: unknown, { userId }: { userId: string }) => {
      return usersArr.find(user => user.id === userId)
    }
  },
  Todo: {
    user: (parent: { userId: string }) => {
      return usersArr.find(user => user.id === parent.userId)
    }
  },
  User: {
    todos: (parent: { id: string }) => {
      return todosArr.filter(todo => todo.userId === parent.id)
    }
  }
}

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Start Apollo Server
const startServer = async () => {
  const { url } = await startStandaloneServer(server)
  console.log(`Server is running on ${url}`)
}

startServer()