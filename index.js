import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";
import random from "random";

const path = "./data.json";

// Array of cool commit messages
const coolCommitMessages = [
  "refactor: clean architecture implemented",
  "feat: major breakthrough achieved",
  "fix: edge case eliminated",
  "perf: optimization complete",
  "style: pixel perfect alignment",
  "docs: clarity enhanced",
  "test: coverage maximized",
  "build: pipeline streamlined",
  "ci: workflow optimized",
  "chore: dependencies updated",
  "feat: game changer deployed",
  "fix: critical issue resolved",
  "perf: bottleneck removed",
  "refactor: code elegance restored",
  "feat: functionality expanded",
  "fix: silent bug squashed",
  "style: visual harmony achieved",
  "docs: knowledge base enriched",
  "test: reliability strengthened",
  "build: process refined",
  "feat: innovation unleashed",
  "fix: stability restored",
  "perf: speed boost applied",
  "refactor: complexity reduced",
  "feat: capability enhanced",
  "fix: anomaly corrected",
  "style: aesthetics improved",
  "docs: documentation polished",
  "test: edge cases covered",
  "build: efficiency gained",
  "feat: milestone reached",
  "fix: regression prevented",
  "perf: latency minimized",
  "refactor: maintainability improved",
  "feat: feature set completed",
  "fix: data integrity secured",
  "style: consistency enforced",
  "docs: examples clarified",
  "test: scenarios validated",
  "build: deployment simplified",
  "feat: user experience elevated",
  "fix: memory leak plugged",
  "perf: cache optimization",
  "refactor: design patterns applied",
  "feat: integration successful",
  "fix: concurrency issue resolved",
  "style: responsive design implemented",
  "docs: api documentation updated",
  "test: unit coverage improved",
  "build: configuration streamlined"
];

// Function to get random commit message
const getRandomCommitMessage = () => {
  return coolCommitMessages[random.int(0, coolCommitMessages.length - 1)];
};

const markCommit = (x, y) => {
  // Ensure no commits after September 2025 by capping the end date
  const endDate = moment("2025-09-29"); // Current date limit
  const startDate = moment().subtract(1, "y").add(1, "d");
  const randomDate = startDate.clone().add(x, "w").add(y, "d");
  
  // If the random date exceeds September 2025, use a date within the valid range
  const date = randomDate.isAfter(endDate) ? 
    startDate.clone().add(random.int(0, Math.floor(endDate.diff(startDate, 'days'))), 'days').format() : 
    randomDate.format();

  const data = {
    date: date,
  };

  const commitMessage = getRandomCommitMessage();
  console.log(`Commit: ${commitMessage} (${date})`);
  
  jsonfile.writeFile(path, data, () => {
    simpleGit().add([path]).commit(commitMessage, { "--date": date }).push();
  });
};

const makeCommits = (n) => {
  if(n===0) return simpleGit().push();
  
  // 30% chance to create a cluster of 2-4 commits on the same day for darker green
  const shouldCluster = Math.random() < 0.3;
  const clusterSize = shouldCluster ? random.int(2, 4) : 1;
  
  const x = random.int(0, 54);
  const y = random.int(0, 6);
  // Ensure no commits after September 2025 by capping the end date
  const endDate = moment("2025-09-29"); // Current date limit
  const startDate = moment().subtract(1, "y").add(1, "d");
  const randomDate = startDate.clone().add(x, "w").add(y, "d");
  
  // If the random date exceeds September 2025, use a date within the valid range
  const baseDate = randomDate.isAfter(endDate) ? 
    startDate.clone().add(random.int(0, Math.floor(endDate.diff(startDate, 'days'))), 'days') : 
    randomDate;

  // Create multiple commits on the same day with slight time variations
  for(let i = 0; i < clusterSize && n > 0; i++) {
    // Add random hours/minutes to spread commits throughout the day
    const date = baseDate.clone().add(random.int(0, 23), 'hours').add(random.int(0, 59), 'minutes').format();
    
    const data = {
      date: date,
    };
    
    const commitMessage = getRandomCommitMessage();
    console.log(`Commit: ${commitMessage} (${date}) ${shouldCluster ? `[Cluster ${i+1}/${clusterSize}]` : ''}`);
    
    jsonfile.writeFile(path, data, () => {
      simpleGit().add([path]).commit(commitMessage, { "--date": date }, i === clusterSize - 1 ? makeCommits.bind(this, n - clusterSize) : () => {});
    });
    
    if(i < clusterSize - 1) {
      // Small delay between clustered commits
      setTimeout(() => {}, 100);
    }
  }
};

makeCommits(25);
