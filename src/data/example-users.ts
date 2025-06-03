
import { User } from "@/types";
import { exampleUser, predefinedWorkers } from "./users/predefined-users";
import { generateUsers } from "./users/user-generator";

// Export the main example user
export { exampleUser };

// Generate additional workers to reach the desired total
const generatedWorkers = generateUsers(180, 21); // Start from ID 21 since we have 20 predefined

// Combine predefined and generated workers
export const exampleWorkers: User[] = [
  ...predefinedWorkers,
  ...generatedWorkers
];

// Export individual predefined workers for backward compatibility
export const [
  exampleWorker1,
  exampleWorker2, 
  exampleWorker3,
  exampleWorker4
] = predefinedWorkers;
