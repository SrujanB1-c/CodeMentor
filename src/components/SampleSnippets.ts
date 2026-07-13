export interface SampleSnippet {
  id: string;
  name: string;
  language: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  code: string;
}

export const SAMPLE_SNIPPETS: SampleSnippet[] = [
  {
    id: "fib-memo",
    name: "Recursive Fibonacci (Unoptimized)",
    language: "javascript",
    description: "A standard recursive Fibonacci sequence generator that suffers from O(2^N) exponential time complexity due to redundant call trees.",
    difficulty: "Beginner",
    code: `function fibonacci(n) {
  if (n <= 1) {
    return n;
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Calculate the 40th Fibonacci number
console.log(fibonacci(40));`
  },
  {
    id: "react-effect-leak",
    name: "React Clock (Memory Leak)",
    language: "typescript",
    description: "A React component that displays an active timer but creates a memory leak by setting an interval without performing proper hook cleanup.",
    difficulty: "Intermediate",
    code: `import React, { useState, useEffect } from 'react';

export function LiveTimer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // BUG: Setting interval without storing ID and clearing it on unmount
    setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    
    console.log("Timer started...");
  }, []); // Empty dependency array

  return (
    <div className="timer-container">
      <h3>Active Session Duration</h3>
      <p className="time">{seconds}s elapsed</p>
    </div>
  );
}`
  },
  {
    id: "go-concurrency-race",
    name: "Go Bank Wallet (Race Condition)",
    language: "go",
    description: "A concurrent wallet transfer implementation in Go containing a critical race condition. Lacks synchronization/mutex for shared balances.",
    difficulty: "Advanced",
    code: `package main

import (
	"fmt"
	"time"
)

type Wallet struct {
	balance int
}

func (w *Wallet) Deposit(amount int) {
	temp := w.balance
	// Simulate minor database latency
	time.Sleep(time.Millisecond * 5)
	w.balance = temp + amount
}

func main() {
	wallet := &Wallet{balance: 100}

	// Spin up 10 concurrent depositors
	for i := 0; i < 10; i++ {
		go func() {
			wallet.Deposit(10)
		}()
	}

	time.Sleep(time.Second)
	// Balance should be 200, but is highly unpredictable!
	fmt.Printf("Final wallet balance: %d\\n", wallet.balance)
}`
  },
  {
    id: "python-buggy-sort",
    name: "Python Binary Search (Buggy)",
    language: "python",
    description: "A binary search implementation in Python that contains an infinite loop bug due to improper pointer adjustments in the middle calculations.",
    difficulty: "Intermediate",
    code: `def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    
    while low <= high:
        # Potential integer overflow / improper midpoint
        mid = (low + high) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            # BUG: Mid is not incremented, leading to infinite loop
            low = mid
        else:
            # BUG: Mid is not decremented, leading to infinite loop
            high = mid
            
    return -1

# Let's test searching for 7 in a sorted list
numbers = [1, 3, 5, 7, 9, 11]
index = binary_search(numbers, 7)
print(f"Target found at index: {index}")`
  },
  {
    id: "rust-file-unwrap",
    name: "Rust File Reader (Panic Prone)",
    language: "rust",
    description: "A Rust function that reads and parses numbers from a local file, using unsafe/non-idiomatic unwraps that will panic if the file is missing or corrupted.",
    difficulty: "Beginner",
    code: `use std::fs::File;
use std::io::{BufRead, BufReader};

fn parse_and_sum_scores(file_path: &str) -> i32 {
    // Unsafe unwrap - will panic if the file does not exist
    let file = File::open(file_path).unwrap();
    let reader = BufReader::new(file);
    let mut total_score = 0;

    for line in reader.lines() {
        // Will panic if there's an I/O reading error
        let line_str = line.unwrap();
        // Will panic if a line contains non-integer characters
        let num: i32 = line_str.trim().parse().unwrap();
        total_score += num;
    }

    total_score
}`
  }
];
