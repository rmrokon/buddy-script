const AVATARS = [
  "/assets/images/people1.png",
  "/assets/images/people2.png",
];

/**
 * Returns a random avatar path from a predefined list.
 * @param seed Optional seed to consistently pick the same avatar (e.g., userId).
 */
export const getRandomAvatar = (seed?: string) => {
  if (seed) {
    // Basic hash to map string to an index
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % AVATARS.length);
    return AVATARS[index];
  }
  
  const randomIndex = Math.floor(Math.random() * AVATARS.length);
  return AVATARS[randomIndex];
};
