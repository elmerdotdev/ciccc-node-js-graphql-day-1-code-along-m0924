import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone'

// Sample data
const customersData = [
  { id: "1", name: "John Smith", email: "john@mail.com" },
  { id: "2", name: "Jane Doe", email: "jane@mail.com" },
  { id: "3", name: "Joe Moe", email: "joe@mail.com" },
]

const productsData = [
  { id: "1", productName: "iPhone 30 Pro Max", price: 199.00 },
  { id: "2", productName: "Macbook M8", price: 49.00 },
  { id: "3", productName: "Vision Pro 5", price: 2499.00 },
]

const ordersData = [
  { id: "1", customerId: "1", productsId: ["1", "3"] },
  { id: "2", customerId: "2", productsId: ["2"] },
  { id: "3", customerId: "3", productsId: ["2", "3"] },
]

// Type Definitions
const typeDefs = `#graphql
  type Customer {
    id: ID,
    name: String,
    email: String,
    orders: [Order],
    welcome: String
  }

  type Product {
    id: ID,
    productName: String,
    price: Float
  }

  type Order {
    id: ID,
    customer: Customer,
    products: [Product]
  }

  type Query {
    customers: [Customer],
    products: [Product],
    orders: [Order],
    customerById(customerId: ID): Customer,
    productById(productId: ID): Product
  }
`

// Resolvers
const resolvers = {
  Query: {
    customers: () => customersData,
    products: () => productsData,
    orders: () => ordersData,
    customerById: (_: unknown, { customerId } : { customerId: string }) =>
      customersData.find(customer => customer.id === customerId),
    productById: (_: unknown, { productId }: { productId: string }) =>
      productsData.find(product => product.id === productId)
  },
  Order: {
    customer: (parent: { customerId: string }) =>
      customersData.find(customer => customer.id === parent.customerId),
    products: (parent: { productsId: [string] }) =>
      productsData.filter(product => parent.productsId.includes(product.id))
  },
  Customer: {
    orders: (parent: { id: string }) =>
      ordersData.filter(order => order.customerId === parent.id),
    welcome: () => "Hello people!"
  }
}

// Create Server
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// Start Server
const startServer = async () => {
  const { url } = await startStandaloneServer(server)
  console.log(`Server is running on ${url}`)
}

startServer()