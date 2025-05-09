import React, { useState, useEffect } from 'react';
import './App.css';
import { ethers } from 'ethers';
import PollDAppABI from './PollDAppABI.json';

const CONTRACT_ADDRESS = "0x10021f8cb4730c3d8f6a595c9c0b6d5ee8aef130"; // Replace with your deployed contract address

function App() {
  const [account, setAccount] = useState(null);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState('');
  const [duration, setDuration] = useState(''); // Duration in minutes
  const [loading, setLoading] = useState(false);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
      });
    }
    fetchPolls();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    } else {
      alert("MetaMask is not installed.");
    }
  };

  const addOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
    }
  };

  const createPoll = async () => {
    if (!question.trim() || options.length < 2 || !duration) {
      alert("Please enter a question, at least two options, and a duration.");
      return;
    }

    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PollDAppABI, signer);

      const durationInSeconds = parseInt(duration) * 60;
      const tx = await contract.createPoll(question, options, durationInSeconds);
      await tx.wait();

      alert("✅ Poll created successfully!");
      setQuestion('');
      setOptions([]);
      setDuration('');
      fetchPolls();
    } catch (error) {
      console.error("Error creating poll:", error);
      alert("❌ Failed to create poll. Check console for details.");
    }
    setLoading(false);
  };

  const vote = async (pollId, optionIndex) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PollDAppABI, signer);

      const tx = await contract.vote(pollId, optionIndex);
      await tx.wait();
      alert("✅ Vote submitted!");
      fetchPolls();
    } catch (error) {
      console.error("Error voting:", error);
      alert("❌ Failed to vote. Check console for details.");
    }
  };

  const fetchPolls = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, PollDAppABI, provider);

      const count = await contract.getPollCount();
      const fetchedPolls = [];

      for (let i = 0; i < count; i++) {
        const poll = await contract.getPoll(i);
        fetchedPolls.push({
          id: i,
          question: poll[0],
          options: poll[1],
          votes: poll[2],
          creator: poll[3],
          isActive: poll[4],
        });
      }

      setPolls(fetchedPolls);
    } catch (error) {
      console.error("Error fetching polls:", error);
    }
  };

  return (
    <div className="App">
      <h1>DecentraPoll DApp</h1>

      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p><strong>Connected:</strong> {account}</p>
      )}

      <div className="poll-creation">
        <h2>Create a New Poll</h2>

        <input
          type="text"
          placeholder="Poll Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <input
          type="text"
          placeholder="Poll Option"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
        />
        <button onClick={addOption}>Add Option</button>

        <ul>
          {options.map((opt, idx) => (
            <li key={idx}>{opt}</li>
          ))}
        </ul>

        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />

        <button onClick={createPoll} disabled={loading}>
          {loading ? "Creating Poll..." : "Create Poll"}
        </button>
      </div>

      <div className="poll-list">
        <h2>Existing Polls</h2>
        {polls.length === 0 ? (
          <p>No polls found.</p>
        ) : (
          polls.map((poll) => {
            return (
              <div key={poll.id} className="poll-card">
                <h3>{poll.question}</h3>
                <ul>
                  {poll.options.map((opt, index) => (
                    <li key={index}>
                      {opt} — {poll.votes[index].toString()} votes
                      {poll.isActive && (
                        <button
                          onClick={() => vote(poll.id, index)}
                          style={{ marginLeft: "10px" }}
                        >
                          Vote
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
                <p>Status: {poll.isActive ? "Active" : "Closed"}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default App;
