
function isValidMove(maze, visited, x, y) {
    return (
        x >= 0 && x < maze.length &&
        y >= 0 && y < maze[0].length &&
        maze[x][y] === 0 && !visited[x][y]
    );
}

// DFS function to solve the maze
function dfs(maze, visited, x, y, endX, endY, path) {
    // If the current position is the end position, return true
    if (x === endX && y === endY) {
        path.push([x, y]);
        return true;
    }

    // Mark the current position as visited
    visited[x][y] = true;
    path.push([x, y]);

    // Define the possible moves (right, down, left, up)
    const moves = [
        [0, 1],  // right
        [1, 0],  // down
        [0, -1], // left
        [-1, 0]  // up
    ];

    // Try each possible move
    for (const [dx, dy] of moves) {
        const newX = x + dx;
        const newY = y + dy;

        if (isValidMove(maze, visited, newX, newY)) {
            if (dfs(maze, visited, newX, newY, endX, endY, path)) {
                return true;
            }
        }
    }

    // If no move is possible, backtrack
    path.pop();
    return false;
}

// Function to solve the maze
function solveMaze(maze, startX, startY, endX, endY) {
    const visited = Array.from({ length: maze.length }, () => Array(maze[0].length).fill(false));
    const path = [];

    if (dfs(maze, visited, startX, startY, endX, endY, path)) {
        return path;
    } else {
        return null; // No solution found
    }
}

export { solveMaze };