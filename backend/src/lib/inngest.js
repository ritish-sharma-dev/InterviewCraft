import { Inngest } from 'inngest';
import { connectDB } from './db.js';
import User from '../models/user.model.js';

// CREATE A CLIENT TO SEND AND RECEIVE EVENTS
export const inngest = new Inngest({ id: 'interviewCraft' });

const createUserInDB = inngest.createFunction(
    { id: "create-user-in-db", triggers: [{ event: "clerk/user.created" }] },
    async ({ event }) => {
        await connectDB();

        const { id, email_addresses, first_name, last_name, image_url } = event.data;

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: `${first_name || ''} ${last_name || ''}`,
            profileImage: image_url,
        };

        await User.create(newUser);
    },
);

const deleteUserFromDB = inngest.createFunction(
    { id: "delete-user-from-db", triggers: [{ event: "clerk/user.deleted" }] },
    async ({ event }) => {
        await connectDB();

        const { id } = event.data;
        await User.deleteOne({ clerkId: id });
    },
);

// CREATE AN EMPTY ARRAY WHERE WE'LL EXPORT FUTURE INNGEST FUNCTIONS
export const functions = [createUserInDB, deleteUserFromDB];