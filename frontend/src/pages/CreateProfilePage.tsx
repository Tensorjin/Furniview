import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import styles from './CreateProfilePage.module.css'; // We'll create this CSS file

const CreateProfilePage: React.FC = () => {
    const { session, fetchCompanyProfile } = useAuth(); // Need session for token, fetchCompanyProfile to refresh after creation
    const [companyName, setCompanyName] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!session) {
            setError("You must be logged in to create a profile.");
            return;
        }
        setLoading(true);
        setError(null);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

        try {
            await axios.post(
                `${apiUrl}/api/companies`,
                { companyName },
                {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`
                    }
                }
            );
            // Profile created successfully, refetch the profile in the context
            await fetchCompanyProfile();
            // AuthContext listener or ProtectedRoute should now redirect to dashboard
            alert("Profile created successfully!"); // Or handle navigation more gracefully

        } catch (err: any) {
            console.error("Error creating company profile:", err);
            setError(err.response?.data?.error || err.message || 'Failed to create profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1>Create Company Profile</h1>
            <p>Please enter your company name to continue.</p>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="companyName">Company Name:</label>
                    <input
                        type="text"
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit" disabled={loading} className={styles.submitButton}>
                    {loading ? 'Creating...' : 'Create Profile'}
                </button>
            </form>
        </div>
    );
};

export default CreateProfilePage;
