import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// API Route to Fetch Data from Supabase
app.get('/api/drivers', async (req, res) => {
    const { data, error } = await supabase.from('drivers').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

<<<<<<< HEAD
app.get('/api/constructors', async (req, res) => {
    const { data, error } = await supabase.from('constructors').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get('/api/circuits', async (req, res) => {
    const { data, error } = await supabase.from('circuits').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});


=======
>>>>>>> 02af7e9 (Node.js set up with basic database interaction test)
// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
