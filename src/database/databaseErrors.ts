export class DatabaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DatabaseNotOpenError extends DatabaseError {
  constructor() {
    super('Database is not open. Call open() first.');
  }
}

export class TablesNotInitializedError extends DatabaseError {
  constructor() {
    super('Database tables are not initialized. Call open() first.');
  }
}

export class SQLError extends DatabaseError {
  constructor(
    message: string,
    public sql: string,
    public params: any[],
    originalError?: any,
  ) {
    super(message, originalError);
    this.name = 'SQLError';
  }
}
