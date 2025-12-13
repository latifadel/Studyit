import { db, User } from '@/lib/db';
import crypto from 'crypto';

/**
 * Service to handle user authentication (signup, login).
 */
export const AuthService = {
    /**
     * Registers a new user.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<User | null>} The created user object, or null if the user already exists.
     */
    async signup(email: string, password: string): Promise<User | null> {
        const data = db.read();

        if (data.users.some(u => u.email === email)) {
            return null; // User exists
        }

        const newUser: User = {
            id: crypto.randomUUID(),
            email,
            passwordHash: hashPassword(password),
            name: email.split('@')[0],
            preferences: {
                subjects: [],
                goal: 'Learn new skills',
                style: 'Visual',
                theme: 'light'
            }
        };

        data.users.push(newUser);

        // Initialize empty data for new user
        data.performance.push({
            userId: newUser.id,
            xp: 0,
            level: 1,
            streak: 0,
            lastStudyDate: new Date().toISOString(),
            totalStudyTime: 0
        });

        db.write(data);
        return newUser;
    },

    /**
     * Authenticates a user.
     * @param {string} email - The user's email address.
     * @param {string} password - The user's password.
     * @returns {Promise<User | null>} The user object if authentication is successful, null otherwise.
     */
    async login(email: string, password: string): Promise<User | null> {
        const data = db.read();
        const user = data.users.find(u => u.email === email);

        if (!user || user.passwordHash !== hashPassword(password)) {
            return null;
        }

        return user;
    }
};

function hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
}
