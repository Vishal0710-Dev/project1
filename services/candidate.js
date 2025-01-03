import User from '../models/user.js';
import Candidate from '../models/candidate.js';

export const isAdmin = async (userID) => {
    try {
        const user = await User.findById(userID);
        return user.role === 'admin';
    } catch (err) {
        throw new Error('Error checking admin role');
    }
};

export const addCandidate = async (data) => {
    try {
        const newCandidate = new Candidate(data);
        return await newCandidate.save();
    } catch (err) {
        throw new Error('Error adding candidate');
    }
};


export const updateCandidate = async (candidateId, updatedData) => {
    try {
        return await Candidate.findByIdAndUpdate(candidateId, updatedData, {
            new: true,
            runValidators: true,
        });
    } catch (err) {
        throw new Error('Error updating candidate');
    }
};

export const deleteCandidate = async (candidateId) => {
    try {
        return await Candidate.findByIdAndDelete(candidateId);
    } catch (err) {
        throw new Error('Error deleting candidate');
    }
};

export const voteForCandidate = async (candidateID, userID) => {
    try {
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) throw new Error('Candidate not found');

        const user = await User.findById(userID);
        if (!user) throw new Error('User not found');
        if (user.isVoted) throw new Error('User has already voted');
        if (user.role === 'admin') throw new Error('Admin cannot vote');
        if (user.WardNumber !== candidate.WardNumber) throw new Error('Cannot vote for candidates outside your ward Number');

        candidate.votes.push({ user: userID });
        candidate.voteCount++;
        await candidate.save();

        user.isVoted = true;
        await user.save();
    } catch (err) {
        throw err;
    }
};

export const getVoteCounts = async () => {
    try {
        const candidates = await Candidate.find().sort({ voteCount: 'desc' });
        return candidates.map((candidate) => ({
            party: candidate.party,
            count: candidate.voteCount,
        }));
    } catch (err) {
        throw new Error('Error fetching vote counts');
    }
};