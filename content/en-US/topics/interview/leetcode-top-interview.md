# LeetCode Top Interview Questions

## Top 150

### Array & String

#### 88. Merge Sorted Array

+ Two pointers, all start from the end
+ Iterate from the end as well
+ Copy the rest

#### 27. Remove Item

two pointers, one tracks valid number, one iterates.

#### 26. Remove Duplicates from Sorted Array

two pointers, one tracks concecutive duplicated, one iterates.

#### 80. Remove Duplicates from Sorted Array II

Similar to 26, the starting point and `if` condition are different. Generalize to max k duplicated.
+ First k element always valid.

#### 169. Majority Element

+ Appears more than n / 2
+ Sort and return the median

#### 189. Rotate Array

+ Rotate all -> rotate first k -> rotate remaining

#### 121. Best Time to Buy and Sell Stock

+ Track min profit so far
+ Calculate potential profit each step, and update

#### 122: Best Time to Buy and Sell Stock II

+ Every increase is an oppotunity to make profit
+ Sum up all the increase

#### 55. Jump Game

+ Track the max reachable index
+ if index > max reach -> false. update max reach

#### 45. Jump Game II



#### 383. Ransom Note

+ Use hash table to count occurrence of each letter
+ Knowing all the characters are letter, we can use array instead of hash table

#### 141. Linked List Cycle

+ Two pointer, slow and fast

### Intervals

#### 228. Summary Ranges

+ Two pointer, one point to the range start, one is iterating
+ **Be creaful of the condition**

### Stack

#### 20. Valid Parentheses

+ Use stack to hold the iterated characters
+ Closing bracket at the front, e.g. {'}', '{'}

### Binary Tree General

#### 104. Maximum Depth of Binary Tree

+ Small tree use DFS, deep trees use **BFS**.

#### 100. Same Tree

+ Try **BFS**

### Graph General

#### 200. Number of Islands

+ DFS. Traverse grid, mark (try to sink) visited cell

### Binary

#### 67. Add Binary

+ Simulate binary addition (with two pointers)

### 1D DP

#### 70. Climbing Stairs

+ Recurrence relation: `dp[n] = dp[n - 1] + dp[n - 2]`
+ Base case is dp[1] = 1, dp[2] = 2
+ Use the spatial efficient method

---

## Meta Tagged Questions

### [1249. Minimum Remove to Make Valid Parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses)

Two passes with stack
1. 1st pass: locate the unpaired ')'
2. Add the left '(' indices in the stack
3. Build new string by removing invalid indices

Time: O(N), Space: O(N)

### 408. Valid Word Abbreviation

**PROBLEM STATEMENT**

Given a string `word` and an abbreviation `abbr`, return `true` if `abbr` is a valid abbreviation for `word`, otherwise return `false`.

A valid abbreviation follows these rules:
+ A number in `abbr` represents skipping that many characters in word.
+ Numbers cannot have leading zeros (e.g., "01" is invalid).
+ The skipped characters must match the length indicated by the number.

Examples

```cpp
// Input
word = "internationalization"
abbr = "i12iz4n"
// Output
true

// Input
word = "apple"
abbr = "a2e"
// Output
false
```

Approach: Two Pointers

```cpp
#include <string>

class Solution {
public:
    bool validWordAbbreviation(const std::string& word, const std::string& abbr) {
        // Two pointer: one for word, one for abbr
        size_t i{0}, j{0};
        while (i < word.size() && j < abbr.size()) {            
            // match digit
            if (const auto& ch_a = abbr[j]; std::isdigit(ch_a)) {
                // No leading '0' 
                if (ch_a == '0') {
                    return false;
                }

                // read number
                auto num{0};
                while (j < m && std::isdigit(abbr[j])) {
                    num = num * 10 + (abbr[j] - '0');
                    j++;
                }

                // move forward
                i += num;
            } else { // match word
                // Mismatch
                if (ch_a != word[i]) {
                    return false;
                }

                i++;
                j++;
            }
        }

        // Fully processed
        return i == word.size() && j == abbr.size();
    }
}
```

Time: O(Word length + abbr length), Space: O(1)

### [680. Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/)

Two pointers with (one) Skip
+ Lambda: Check Palindrome between range
+ Use `left` and `right` pointer to compare characters
+ If mismatch, try skip one step right/left
+ Check if the remaining substring is valid palindrome.

Time: O(N), Space: O(1)

### 314. Binary Tree Vertical Order Traversal / [987. Vertical Order Traversal of a Binary Tree](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/)

314 BFS with column tracking

```cpp

// Definition for a binary tree node.
// struct TreeNode {
//     int val;
//     TreeNode *left;
//     TreeNode *right;

//     TreeNode(int val = 0): TreeNode(val, nullptr, nullptr) {}
//     TreeNode(int x, TreeNode *left, TreeNode *right): val(x), left(left), right(right) {}
// };

class Solution {
public:
    std::vector<std::vector<int>> verticalTraversal(TreeNode* root) {
        if (!root) {
            return {};
        }

        // We need a ordered map. Column -> Nodes' value
        std::map<int, std::vector<int>> col_nodes;

        // Node -> Column
        std::queue<std::pair<TreeNode*, int>> q;
        q.push({root, 0});
        
        // BFS
        while (!q.empty()) {
            // Copy on purpose
            auto [node, column] = q.front();
            q.pop();

            col_nodes[column].push_back(node->val);

            if (auto left = node->left) {
                q.push({left, column - 1});
            }
            if (auto right = node->right) {
                q.push({right, column + 1});
            }
        }

        std::vector<std::vector<int>> res;
        for (const auto& [_, nodes]: col_nodes) {
            res.push_back(nodes);
        }

        return res;
    }
};
```

987 DFS with sorting

+ Transverse nodes to collect (col, row)
+ Sort the nodes by Column(left->right) -> Row(top->bottom) -> Value(ascending)
+ Group the values by **column**

### [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/des)

**FOCUS**

QuickSelect. For general condition

Min-Heap. For large K

### [227. Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/)

+ Use stack to handle mulitplication/division operators
+ Iterate through the string, build up number or sum up

### 1650. Lowest Common Ancestor of a Binary Tree III

**PROBLEM STATEMENT**

Given two nodes in a binary tree where each node contains a parent pointer, find their lowest common ancestor (LCA).

```cpp
class Solution {
public:
    Node* lowestCommonAncestor(Node* p, Node* q) {
        // Two pointers
        auto p1{p};
        auto p2{q};
        while (p1 != p2) {
            // 1. Move pointer upward to parent
            // 2. If pointer reaches nullptr, restart at the other's position
            p1 = p1 ? p1->parent : q;
            p2 = p2 ? p2->parent : p;
        }

        return p1;
    }
}
```

### [528. Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight/)

+ Build a prefix sum array (and total sum) from the input array
+ Pick random value x between [1, total]
+ Use binary search to find the lowerbound where prefixSum[i] >= x

### [162. Find Peak Element](https://leetcode.com/problems/find-peak-element/)

+ Binary search

### [236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

+ DFS on left and right
+ Difference with LCA III is no parent node given in the Node

### [50. Pow(x, n)](https://leetcode.com/problems/powx-n/)

+ Divide and Conquer
+ Corner case n == 0, return 1
+ Use recursive/iteration. if n is even, $x^n = (x^2)^{n / 2}$, if n is odd, $x^n = x * x^{n-1}$

### [71. Simplify Path](https://leetcode.com/problems/simplify-path/)

+ Split the input path with '/'.
+ Process each part
  + ".." -> move up one
  + "." and "" -> ignore
  + Other are valid name
+ Build output string. Always startsWith '/', try not to use condition in the loop

### [1091. Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)

+ Since we want a shortest path, use BFS
+ Explore 8 directions
+ Track visited nodes to avoid cycles

### 1570. Dot Product of Two Sparse Vectors

**PROBLEM STATEMENT**

Given two sparse vectors, implement their dot product efficiently.

A sparse vector contains mostly 0s, so storing and computing all elements naively is inefficient.

Implement a class `SparseVector` with:

+ Constructor: `SparseVector(vector<int>& nums)`
+ Dot product function: `int dotProduct(SparseVector& vec)`

```cpp
// Store Non-Zero element
class SparseVector {
public:
    // {index: value}
    std::vector<std::pair<size_t, int>> nonzeros;

    explicit SparseVector(const std::vector<int>& nums) {
        for (size_t i{0}; i < nums.size(); ++i) {
            if (const auto& num = nums[i]; num != 0) {
                nonzeros.push_back({i, num});
            }
        }
    }

    int dotProduct(const SparseVector& o) {
        auto res{0};
        size_t i{0}, j{0};
        while (i < nonzeros.size() && j < o.nonzeros.size()) {
            if (auto i1 = nonzeros[i].first, i2 = nonzeros[j].first; i1 == i2) {
                res += nonzeros[i].second * nonzeros[j].second;
                i++;
                j++;
            } else if (i1 < i2) {
                i++;
            } else {
                j++;
            }
        }
        return res;
    }
}
```

Time: O(N), Space: O(K), where K is non zero element count.

### [938. Range Sum of BST](https://leetcode.com/problems/range-sum-of-bst/)

+ Recursive DFS. If current val smaller than low, search right, if current val larger than high, search left

### [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)

+ Two points start from the beginning and end
+ ignore the non-alnum characters
+ to lowercase and compare

### [560. Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)

**QUESTIONS**

+ Prefix sum, because of subarray sum
+ if $sum[j] - sum[i] = k$, then subarray nums[i+1: j] sums to k

### [543. Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)

+ Diameter is the maximum of 1. left node, 2. right node, 3. the longest path goes through the node
+ Because we need to know to height, so use DFS 

### [199. Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view)

+ Because we need to iterate the tree by layer, so BFS
+ The last node is the right most node in current layer
+ Optional: DFS. Add the right node first, so when list size is same as the depth, that's the right most node

### [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/)

+ sort the input intervals by the mins
+ iterate the sorted intervals and merge based on overlapping

### [146. LRU Cache](https://leetcode.com/problems/lru-cache)


### [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements)

+ Use hashtable to store the frequency
+ Use priority heap to track top k elements

### [973. K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)

+ Use max heap to track top k closest distance

### 1762. Buildings With an Ocean View

**PROBLEM STATEMENT**

There are `n` buildings in a row, indexed from `0` to `n-1`. Each building has a height represented by `heights[i]`.

A building has an ocean view if all buildings to its right have a smaller height.

Return a list of indices of buildings that have an ocean view in increasing order.

```cpp
class Solution {
public:
    std::vector<int> findBuildings(const std::vector<int>& heights) {
        // Track the highest building seen
        auto maxHeight{0};
        std::vector<int> res;
        // Start from the right most building (gurantee ocean view)
        for (int i = heights.size() - 1; i >= 0; --i) {
            if (const auto& height = heights[i]; height > maxHeight) {
                res.push_back(i);
                maxHeight = height;
            }
        }

        std::reverse(res.begin(), res.end());
        return res;
    }
}
```

### [986. Interval List Intersections](https://leetcode.com/problems/interval-list-intersections/)

+ Two pointers, start from the begining
+ An intersection exists if $max(start_1, start_2) \leq min(end_1, end_2)$
+ Move the pointer from the list from the interval ends first.

### [138. Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/)

**WARNING**

+ Copy each node right after the original node (don't care random pointer)
+ Assign random pointer in the copied nodes
+ Separate the copied nodes and original nodes, and recover the original nodes relationship.

### [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

+ Use min heap, as the min always on the top
+ Extra the smallest element from the heap and move to form a pointer.

### 339. Nested List Weight Sum

**Problem Statement**

You are given a nested list of integers. Each element is either:
+ An integer, or
+ A list containing other integers and/or nested lists.

The depth of an integer is the number of lists it is inside.

Return the sum of all integers, weighted by their depth.

Example 1

```cpp
// Input
nestedList = [[1, 1], 2, [1, 1]]
// Output
10
// Explanation
// The '1's are at depth 2, contributing 4*2=8
// The '2' is at depth 1, contributing 2*1=2

```

Approach: DFS

```cpp
#include <vector>

// LeetCode provided interface
class NestedInteger {
public:
    bool isInteger() const;
    int getInteger() const;
    const std::vector<NestedInteger>& getList() const;
}

class Solution {
public:
    int depthSum(std::vector<NestedInteger>& nestedList, int depth = 1) {
        auto sum{0};
        for (const auto& nested: nestedList) {
            if (nested.isInteger()) {
                sum += nested.getInteger() * depth;
            } else {
                sum += depthSum(nested.getList(), depth + 1);
            }
        }
        return sum;
    }
}
```

Time: O(N), Space: O(Depth)

### [129. Sum Root to Leaf Numbers](https://leetcode.com/problems/sum-root-to-leaf-numbers/)

+ Because we need to reach the leaf to build up a number, so DFS
+ Keep track of the sum
+ return sum when reach a leaf

### 346. Moving Average from Data Stream

**PROBLEM STATEMENT**

You need to implement a class `MovingAverage` that calculates the moving average of the last `size` elements in a data stream.

```cpp
#include <queue>

class MovingAverage {
public:
    explicit MovingAverage(int size): _size(size), _sum(0.) {}

    double next(int val) {
        q.push(val);
        sum += val;

        if (q.size() > _size) {
            sum -= q.front();
            q.pop();
        }

        return sum / q.front();
    }

private:
    std::queue<int> _q;
    double _sum;
    const int _size;
}
```

### [282. Expression Add Operators](https://leetcode.com/problems/expression-add-operators/)

**HARD!!!**

### [670. Maximum Swap](https://leetcode.com/problems/maximum-swap/)

+ convert the number to string
+ Track last occurance of each digit from left to right. Help better locate the larger digit to swap
+ Find the best swap

### [791. Custom Sort String](https://leetcode.com/problems/custom-sort-string/)

+ `order` has less character, and it defines the order, so build final string from `order` based on `s` frequency
+ Use frequency map to count occurance in `s`
+ Build result by iterating through `order`
+ Append the remaining letters at the end
  
### [32. Next Permutation](https://leetcode.com/problems/next-permutation/)

**DRAW EXAMPLE**

e.g. 24,857,631 -> 24,867,531 -> 24,861,357

+ Traverse from right to left to find the pivot where $nums[i] < nums[i-1]$
+ Traverse again from right to left to find the **smallest digit** larger than current `nums[i]`, then swap. This digit could be the new start
+ Reverse the sequence from `i+1` to the end

### [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)


### Meeting Rooms

**I. PROBLEM STATEMENT**

Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, determine if a person can attend all meetings (i.e., no overlapping meetings).

```cpp

class Solution {
public:
    bool canAttendMeetings(const std::vector<std::vector<int>>& intervals) {
        // Sort based on the starting time
        std::sort(intervals.begin(), intervals.end());

        // Iterate if any start smaller than previous end
        for (size_t i{1}};i < intervals.size(); ++i) {
            if (intervals[i][0] < intervals[i - 1][1]) {
                return false;
            }
        }

        return true;
    }
}
```

**II. PROBLEM STATEMENT**

Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required.

```cpp
class Solution {
public:
    int minMeetingRooms(const std::vector<std::vector<int>>& intervals) {
        if (intervals.empty()) {
            return 0;
        }

        // Sort based on starting point
        std::sort(intervals.begin(), intervals.end());

        // Use min heap to track the ending, as well as the ongoing meetings
        std::priority_queue<int, std::vector<int>, std::greater> minHeap;

        minHeap.push(intervals[0][1]);

        for (size_t i{1}; i < intervals.size(); ++i) {
            // If current start time larger than earlier ending time
            if (intervals[i][0] >= minHeap.top()) {
                minHeap.pop();
            }
            minHeap.push(intervals[i][1]);
        }

        return minHeap.size();
    }
}
```

**III. PROBLEM STATEMENT**

You are given `n` meeting rooms and an array `meetings`, where `meetings[i] = [start_i, end_i]`. Each meeting must be assigned to a room that is free at that time. If multiple rooms are available, assign the **lowest-indexed** room. If no room is free, the meeting is delayed until the earliest available time.

Return the index of the meeting room that hosted the most meetings. If multiple rooms have the same count, return the smallest index.


### [75. Sort Colors](https://leetcode.com/problems/sort-colors/)

+ We need to partition the array into 3 parts
+ Because in-place sort, so we need to swap
+ Use two pointers
  + `low` tracks 0s, `mid` tracks 1s, `high` tracks 2s
  + `mid` traverse
  + check `nums[mid]`
+ Terminate when `mid` surpasses `high`

### [825. Friends Of Appropriate Ages](https://leetcode.com/problems/friends-of-appropriate-ages/)

+ Read the condition, and narrow down the real condition
  + Condition 1 defines the min age
  + Condition 2 defines the max age
  + Special case is when max and min equal, $age = age * 0.5 + 7$, so min valid age is 14 + 1
  + age is between 1...120
  + Use age range to try Condition 3, find out it's useless
  + For each age, we need to find the people count in valid range
  + Use count and prefix sum on ages


### [51. N-Queens](https://leetcode.com/problems/n-queens/)

**HARD**

### [79. Word Search](https://leetcode.com/problems/word-search/)

+ Because we need to search to the end of the word to find a word, so use DFS
+ Iterate through `board`, search from the first letter
+ Use DFS to explore four directions
+ Mark visited cell before DFS (temporarily)
+ If index is equal to word len (iterate all characters)

### [283. Move Zeroes](https://leetcode.com/problems/move-zeroes/)

+ Move in place, so we need to use two pointers, and swap
+ `slow` tracks where the next non zero pointer should go
+ `fast` find the non-zero elements
+ If found, swap

### Two Sums

**[I. Two Sums]()**

+ Iterate the numbers
+ Use hashtable to store the visited value and its index
+ Find if `target - nums[i]` exists in hashtable

**[II. Two Sums](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)**

+ The difference with previous question is input array is sorted
+ Use two pointers, starts from the beginning and end
+ If sum is less than `target`, move left; greater than `target` move right, or return index pair

**[III. 3Sums](https://leetcode.com/problems/3sum/description/)**

+ Sort the values


---

## LeetCode Roadmap

### Learn by ROI

|        Topic        | Difficulty |    ROI    |
| :-----------------: | :--------: | :-------: |
|        Basic        |    Easy    | Very High |
|    Two Pointers     |    Easy    |   High    |
|   Sliding Window    |    Easy    |   High    |
|         BFS         |    Easy    |   High    |
|         DFS         |   Medium   |   High    |
|    Backtracking     |    High    |   High    |
|        Heap         |   Medium   |  Medium   |
|    Binary Search    |    Easy    |  Medium   |
| Dynamic Programming |    High    |  Medium   |
| Divide and Conquer  |   Medium   |    Low    |
|        Trie         |   Medium   |    Low    |
|     Union Find      |   Medium   |    Low    |
|       Greedy        |   Medium   |    Low    |


### Arrays and Hashing

### Binary Search

#### Template

```cpp
bool checkFeasible(int num) {
    // ...
}

int binarySearch(const std::vector<int>& vec, int target) {
    int left{0};
    int right = vec.size() - 1; // size_t
    auto index{-1};
    while (left <= right) {
        const auto mid = left + (left + right) / 2;
        if (checkFeasible(mid)) {
            index = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }

    return index;
}
```
