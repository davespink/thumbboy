//const useRemote = true; // Set to true to use RemoteCrud, false for LocalCrud
/*
let crud;
if (useRemote) {
    crud = new RemoteCrud("https://new-crud.henrytatum.workers.dev"); // Cloudflare Workers URL
   
} else {
    crud = new LocalCrud(); // Local storage
}
*/
 

const crudclientVersion = "1.0.1";

class LocalCRUD {

    async create(key, value) {
      localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve("Created");
    }

    async retrieve(key) {
        const value = localStorage.getItem(key);
        if (value) {
            return Promise.resolve(JSON.parse(value));
        } else {
            return Promise.reject(new Error("Key not found"));
        }
    }

    async update(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        return Promise.resolve("Updated");
    }

    async delete(key) {
        localStorage.removeItem(key);
        return Promise.resolve("Deleted");
    }

    async listAll() {
        const allItems = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            allItems[key] = JSON.parse(localStorage.getItem(key));
        }
        return Promise.resolve(allItems);
    }

    async deleteAll() {
        localStorage.clear();
        return Promise.resolve("All items deleted");
    }
}



class RemoteCRUD {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;      
    }

    async create(key, value) {
        try {
           
            const response = await fetch(`${this.baseUrl}/create?key=${encodeURIComponent(key)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(value),
            });
            return await response.text();
        } catch (error) {
            console.error('Error creating:', error);
            throw error;
        }
    }



/* 


async retrieve(key) {
    try {
        const response = await fetch(`${this.baseUrl}/retrieve?key=${encodeURIComponent(key)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        if (!text) {
            throw new Error("No data found for key");
        }
        return JSON.parse(text);
    } catch (error) {
        console.error('Error retrieving:', error);
        throw error;
    }
}




*/






    async retrieve(key) {

        try {
            const response = await fetch(`${this.baseUrl}/retrieve?key=${encodeURIComponent(key)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            return await response.json();
        } catch (error) {
            console.error('Error retrieving:', error);
            throw error;
        }
    }

    async update(key, value) {
      //  key = this.makeNameSpace(key);
        try {
            const response = await fetch(`${this.baseUrl}/update?key=${encodeURIComponent(key)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(value),
            });
            return await response.text();
        } catch (error) {
            console.error('Error updating:', error);
            throw error;
        }
    }

    async delete(key) {
     //   key = this.makeNameSpace(key);
        try {
            const response = await fetch(`${this.baseUrl}/delete?key=${encodeURIComponent(key)}`, {
                method: 'GET',
            });
            return await response.text();
        } catch (error) {
            console.error('Error deleting:', error);
            throw error;
        }
    }

    async listAll() {
        try {
            const response = await fetch(`${this.baseUrl}/all`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            const result = await response.json();
            return result;
            // If result is an array of objects like [{key: '1111', value: '33333'}, ...]
      //      const keysArray = result.map(item => item.key);
       //     return keysArray;
        } catch (error) {
            console.error('Error listing all:', error);
            throw error;
        }
    }
    async getKeys() {
        try {
            const response = await fetch(`${this.baseUrl}/keys`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
            const result = await response.json();

            // If result is an array of objects like [{key: '1111', value: '33333'}, ...]
          //  const keysArray = result.map(item => item.key);
           // return keysArray;
           return result;
        } catch (error) {
            console.error('Error listing all:', error);
            throw error;
        }
    }
    async deleteAll() {
        try {
            const response = await fetch(`${this.baseUrl}/delete-all`, {
                method: 'POST',
            });
            return await response.text();
        } catch (error) {
            console.error('Error deleting all:', error);
            throw error;
        }
    }
}