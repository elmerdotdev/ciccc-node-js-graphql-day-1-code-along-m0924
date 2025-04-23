import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// Sample data
const authorsData = [
  { id: "1", penName: "Arthur McArthur", nationality: "Canadian" },
  { id: "2", penName: "Jilly Jill-jill", nationality: "Korean" },
  { id: "3", penName: "Charlie McFarley", nationality: "Mexican" },
]

const booksData = [
  { id: "1", title: "Moby Is Sick", year: 2020, authorId: "2" },
  { id: "2", title: "Big Red Riding Hood", year: 2015, authorId: "3" },
  { id: "3", title: "Planet 10", year: 2018, authorId: "1" }
]

// Schema
const typeDefs = `#graphql
  type Author {
    id: ID,
    penName: String,
    nationality: String,
    books: [Book]
  }

  type Book {
    id: ID,
    title: String,
    year: Int,
    author: Author
  }

  type Query {
    authors: [Author],
    books: [Book],
    authorById(authorId: ID): Author
    bookById(bookId: ID): Book
  }
`

// Resolvers
const resolvers = {
  Query: {
    authors: () => authorsData,
    books: () => booksData,
    authorById: (_: unknown, { authorId } : { authorId: string } ) =>
      authorsData.find(author => author.id === authorId),
    bookById: (_: unknown, { bookId } : { bookId: string }) =>
      booksData.find(book => book.id === bookId)
  },
  Book: {
    author: (parent: { authorId: string }) =>
      authorsData.find(author => author.id === parent.authorId)
  },
  Author: {
    books: (parent: { id: string }) =>
      booksData.filter(book => book.authorId === parent.id)
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