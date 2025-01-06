
import { isAdmin, addCandidate, updateCandidate, deleteCandidate, voteForCandidate, getVoteCounts, getCandidates} from '../services/candidate.js';

export const addCandidateController = async (req, res) => {
    try {
        if (!(await isAdmin(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }
        const response = await addCandidate(req.body);
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


export const updateCandidateController = async (req, res) => {
    try {
        if (!(await isAdmin(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }
        const response = await updateCandidate(req.params.candidateID, req.body);
        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const deleteCandidateController = async (req, res) => {
    try {
        if (!(await isAdmin(req.user.id))) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }
        const response = await deleteCandidate(req.params.candidateID);
        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }
        res.status(200).json(response);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const voteController = async (req, res) => {
    try {
        await voteForCandidate(req.params.candidateID, req.user.id);
        res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const getVoteCountsController = async (req, res) => {
    try {
        const voteCounts = await getVoteCounts();
        res.status(200).json(voteCounts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

export const getCandidatesController = async (req, res) => {
    try{
        const candidates = await getCandidates();
        res.status(200).json({ candidates });
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};