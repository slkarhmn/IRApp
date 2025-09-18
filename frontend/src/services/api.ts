const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Patient endpoints
  async getPatients(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/patients${queryString ? `?${queryString}` : ''}`);
  }

  async getPatient(id) {
    return this.request(`/patients/${id}`);
  }

  async searchPatients(query) {
    return this.request(`/patients/search?q=${encodeURIComponent(query)}`);
  }

  // Procedure endpoints
  async getProcedures(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/procedures${queryString ? `?${queryString}` : ''}`);
  }

  async getProcedure(id) {
    return this.request(`/procedures/${id}`);
  }

  async updateProcedureStatus(id, status) {
    return this.request(`/procedures/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Checklist endpoints
  async getChecklist(procedureId) {
    return this.request(`/checklists/${procedureId}`);
  }

  async updateChecklistItem(checklistId, itemId, data) {
    return this.request(`/checklists/${checklistId}/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Alert endpoints
  async getAlerts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/alerts${queryString ? `?${queryString}` : ''}`);
  }

  async acknowledgeAlert(alertId) {
    return this.request(`/alerts/${alertId}/acknowledge`, {
      method: 'PUT',
    });
  }
}

export const api = new ApiService();
