import React, {useState, useEffect} from 'react';


export default function ContactList() {
    const [clients, setClients] = useState([])
    const [serverMessage, setServerMessage] = useState("")
    const [selectedClient, setSelectedClient] = useState(null)

    useEffect(() => {
        addingClient();
    },[])

    const addingClient = async () => {
        setServerMessage("Loading data")
        const data = await fetch("http://localhost:5000/get-client")
        const finalData = await data.json()
        const {msg, documents} = finalData
        setClients(documents)
        setServerMessage(msg)
    }

    const deleteClient = async (clientId) => {
        try {
            const response = await fetch(`http://localhost:5000/delete-client/${clientId}`, {
                method: 'DELETE',
            });
            const data = await response.json()
            if (data.deleted) {
                setClients(clients.filter(client => client._id !== clientId))
                setServerMessage(data.msg)
            } else {
                setServerMessage(data.msg)
            }
        } catch (error) {
            setServerMessage("Error deleting client: " + error.message)
        }
    };

    const showClientDetails = (client) => {
        setSelectedClient(client)
    }


    return (
        <div className="client-list">
            {clients.map((client, index) => (
                <div key={index}>
                    <button className="button-client" onClick={() => showClientDetails(client)}>
                        {client.firstName} {client.lastName}
                    </button>
                    <button className="button-delete" onClick={() => deleteClient(client._id)}>Delete</button>
                </div>
            ))}
            <div className="msg">{serverMessage}</div>
            {selectedClient && (
                <div className="client-details">
                    <h3>Client Details:</h3>
                    <p>Name: {selectedClient.firstName}</p>
                    <p>Last Name: {selectedClient.lastName}</p>
                    <p>Birth Date: {selectedClient.birthDate}</p>
                    <p>Sex: {selectedClient.sex}</p>
                </div>
            )}
        </div>
    )
}