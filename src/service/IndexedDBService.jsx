class IndexedDBService {
  constructor(dbName, storeName) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.db = null;
  }

  // Check if the database exists
  async checkIfDatabaseExists() {
    return new Promise((resolve, reject) => {
      if (!('databases' in indexedDB)) {
        // Fallback for browsers that don't support indexedDB.databases()
        resolve(false);
        return;
      }

      indexedDB.databases().then((databases) => {
        const exists = databases.some((db) => db.name === this.dbName);
        resolve(exists);
      }).catch((error) => {
        reject(`Error checking if database exists: ${error}`);
      });
    });
  }

  // Open or create the database
  async openDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject(`Error opening database: ${event.target.errorCode}`);
      };
    });
  }

  // Initialize the database (check if it exists, open it, and get data)
  async initialize() {
    const dbExists = await this.checkIfDatabaseExists();
    if (dbExists) {
      console.log('Database already exists. Opening it...');
      await this.openDB();
      return this.GetAll();
    } else {
      console.log('Database does not exist. Creating a new one...');
      await this.openDB();
      return []; // Return an empty array for a new database
    }
  }

  // Get all items
  async GetAll() {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(`Error getting all items: ${request.error}`);
      };
    });
  }

  // Get item by ID
  async GetById(id) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(`Error getting item by ID: ${request.error}`);
      };
    });
  }

  // Save a new item
  async Save(item) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(item);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(`Error saving item: ${request.error}`);
      };
    });
  }

  // Update an existing item
  async Update(item) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(item);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(`Error updating item: ${request.error}`);
      };
    });
  }

  // Delete an item by ID
  async Delete(id) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(`Error deleting item: ${request.error}`);
      };
    });
  }

  // Get filtered data based on params
  async GetFilterData(params) {
    const db = await this.openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        const data = request.result;
        const filteredData = data.filter((item) => {
          return Object.keys(params).every((key) => item[key] === params[key]);
        });
        resolve(filteredData);
      };

      request.onerror = () => {
        reject(`Error getting filtered data: ${request.error}`);
      };
    });
  }

  // Mark a todo as complete
  async MarkAsComplete(id) {
    const db = await this.openDB();
    return new Promise(async (resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);

      request.onsuccess = async () => {
        const item = request.result;
        if (item) {
          item.completed = true; // Assuming there's a 'completed' field
          const updateRequest = store.put(item);
          updateRequest.onsuccess = () => {
            resolve(updateRequest.result);
          };
          updateRequest.onerror = () => {
            reject(`Error updating item to mark as complete: ${updateRequest.error}`);
          };
        } else {
          reject(`Item with ID ${id} not found`);
        }
      };

      request.onerror = () => {
        reject(`Error getting item by ID for marking as complete: ${request.error}`);
      };
    });
  }
}

export default IndexedDBService;