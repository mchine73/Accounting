import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState(null)

  const fetchAccounts = () => {
    setLoading(true)
    axios.get('/api/chart-accounts/')
      .then(res => setAccounts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(fetchAccounts, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await axios.post('/api/chart-accounts/', { code, name, description })
      setAccounts(prev => [...prev, res.data])
      setCode(''); setName(''); setDescription('')
    } catch (err) {
      console.error(err)
      setError('Failed to create account.')
    }
  }

  const handleDelete = async (id) => {
    setError(null)
    try {
      await axios.delete(`/api/chart-accounts/${id}/`)
      setAccounts(prev => prev.filter(acc => acc.id !== id))
    } catch (err) {
      console.error(err)
      setError('Could not delete account.')
    }
  }

  const handleEdit = async (acc) => {
    setError(null)
    try {
      const newCode = prompt("Enter new code:", acc.code)
      if (newCode === null) return
      const newName = prompt("Enter new name:", acc.name)
      if (newName === null) return
      const newDesc = prompt("Enter new description:", acc.description)
      if (newDesc === null) return

      const res = await axios.patch(`/api/chart-accounts/${acc.id}/`, {
        code: newCode,
        name: newName,
        description: newDesc
      })
      setAccounts(prev =>
        prev.map(item => (item.id === acc.id ? res.data : item))
      )
    } catch (err) {
      console.error("Edit failed", err)
      setError("Could not update account.")
    }
  }

  if (loading) return <p>Loading accounts…</p>

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Chart of Accounts</h1>

      <form onSubmit={handleSubmit} className="space-y-2">
        {error && <p className="text-red-600">{error}</p>}

        <div>
          <label className="block">Code</label>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
            className="w-full p-1 border rounded"
          />
        </div>
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="w-full p-1 border rounded"
          />
        </div>
        <div>
          <label className="block">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-1 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Account
        </button>
      </form>

      <hr />

      {accounts.length === 0
        ? <p>No accounts yet.</p>
        : (
          <ul className="list-disc list-inside">
            {accounts.map(acc => (
              <li key={acc.id} className="flex justify-between items-center">
                <span>
                  <strong>{acc.code}</strong>: {acc.name}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEdit(acc)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(acc.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
    </div>
  )
}

export default App
