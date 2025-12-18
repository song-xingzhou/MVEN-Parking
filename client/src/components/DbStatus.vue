<template>
  <div class="db-status-container">
    <div class="db-status">
      <h3>MongoDB Connection Status</h3>
      <div v-if="loading">Checking connection...</div>
      <div v-else>
        <p>
          Status: 
          <span :class="statusClass">{{ dbInfo.status }}</span>
        </p>
        <div v-if="dbInfo.status === 'connected'" class="details">
          <p>Host: {{ dbInfo.host }}</p>
          <p>Port: {{ dbInfo.port }}</p>
          <p>Database: {{ dbInfo.name }}</p>
        </div>
        <button @click="checkConnection">Refresh Status</button>
      </div>
      <div v-if="error" class="error">
        {{ error }}
      </div>
    </div>

    <div v-if="dbInfo.status === 'connected'" class="crud-section">
      <h3>CRUD Test (Users)</h3>
      
      <!-- Create Form -->
      <div class="form-group">
        <input v-model="newUser.name" placeholder="Name" />
        <input v-model.number="newUser.age" type="number" placeholder="Age" />
        <button @click="createUser" :disabled="!newUser.name || !newUser.age">Add User</button>
      </div>

      <!-- List -->
      <div class="user-list">
        <div v-if="usersLoading">Loading users...</div>
        <table v-else>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user._id.substring(user._id.length - 6) }}...</td>
              <td>
                <input v-if="editingId === user._id" v-model="editForm.name" />
                <span v-else>{{ user.name }}</span>
              </td>
              <td>
                <input v-if="editingId === user._id" v-model.number="editForm.age" type="number" />
                <span v-else>{{ user.age }}</span>
              </td>
              <td>
                <div v-if="editingId === user._id">
                  <button @click="saveEdit(user._id)">Save</button>
                  <button @click="cancelEdit">Cancel</button>
                </div>
                <div v-else>
                  <button @click="startEdit(user)">Edit</button>
                  <button @click="deleteUser(user._id)" class="btn-delete">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="4">No users found. Add one above!</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
const API_URL = 'http://localhost:9000/api';

export default {
  name: 'DbStatus',
  data() {
    return {
      loading: false,
      error: null,
      dbInfo: {
        status: 'unknown',
        host: '',
        port: '',
        name: ''
      },
      // CRUD Data
      users: [],
      usersLoading: false,
      newUser: { name: '', age: null },
      editingId: null,
      editForm: { name: '', age: null }
    }
  },
  computed: {
    statusClass() {
      return {
        'status-connected': this.dbInfo.status === 'connected',
        'status-disconnected': this.dbInfo.status !== 'connected'
      }
    }
  },
  mounted() {
    this.checkConnection();
  },
  methods: {
    async checkConnection() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_URL}/test-db`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.dbInfo = data;
        if (data.status === 'connected') {
          this.fetchUsers();
        }
      } catch (e) {
        this.error = 'Failed to connect to backend: ' + e.message;
        this.dbInfo.status = 'error';
      } finally {
        this.loading = false;
      }
    },
    async fetchUsers() {
      this.usersLoading = true;
      try {
        const res = await fetch(API_URL);
        this.users = await res.json();
      } catch (e) {
        console.error('Fetch users failed', e);
      } finally {
        this.usersLoading = false;
      }
    },
    async createUser() {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.newUser)
        });
        if (res.ok) {
          this.newUser = { name: '', age: null };
          this.fetchUsers();
        }
      } catch (e) {
        alert('Create failed: ' + e.message);
      }
    },
    async deleteUser(id) {
      if (!confirm('Are you sure?')) return;
      try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
          this.fetchUsers();
        }
      } catch (e) {
        alert('Delete failed: ' + e.message);
      }
    },
    startEdit(user) {
      this.editingId = user._id;
      this.editForm = { name: user.name, age: user.age };
    },
    cancelEdit() {
      this.editingId = null;
      this.editForm = { name: '', age: null };
    },
    async saveEdit(id) {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.editForm)
        });
        if (res.ok) {
          this.editingId = null;
          this.fetchUsers();
        }
      } catch (e) {
        alert('Update failed: ' + e.message);
      }
    }
  }
}
</script>

<style scoped>
.db-status-container {
  max-width: 600px;
  margin: 0 auto;
}
.db-status {
  border: 1px solid #ccc;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.crud-section {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}

.form-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #eee;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.status-connected {
  color: green;
  font-weight: bold;
}

.status-disconnected {
  color: red;
  font-weight: bold;
}

.details {
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
}

button {
  padding: 5px 10px;
  cursor: pointer;
  margin-right: 5px;
}

.btn-delete {
  background-color: #ffdddd;
  border: 1px solid #ffcccc;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
