# LeetCode Top Interview Questions

## Top 150

### Array & String

#### [88. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)

**Keyword**: Two-Pointer

**Steps**
+ Two pointers, all start from two end (`m-1` and `n-1`)
+ Iteration pointer starts from the very (`m+n-1`) end
  + If `nums[i1] > nums[i2]`, use `nums[i1]`, move i1
  + Else, use `nums[i2]`, move i2
  + Move i
+ Copy the rest from `nums`

Time: O(m+n), Space: O(1)

#### [27. Remove Item](https://leetcode.com/problems/remove-element/)

two pointers, one tracks valid number, one iterates.

#### [26. Remove Duplicates from Sorted Array](https://leetcode.com/problems/remove-duplicates-from-sorted-array/)

two pointers, one tracks concecutive duplicated, one iterates.

#### [80. Remove Duplicates from Sorted Array II](https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/)

Similar to 26, the starting point and `if` condition are different. Generalize to max k duplicated.
+ First k element always valid.

#### [169. Majority Element](https://leetcode.com/problems/majority-element/)

+ Appears more than n / 2
+ Sort and return the median

#### [189. Rotate Array](https://leetcode.com/problems/rotate-array/)

+ Rotate all -> rotate first k -> rotate remaining

#### [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)

**Observations**
+ Buy and sell should happen on different day
+ One operation

**Intuition**
+ Buy low, sell high

**Steps**
+ Track min price and max profit so far
+ Iterate prices
  + Update min price
  + Update potential max profit

Time: O(N), Space: O(1)

#### [122: Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)

**Observations**
+ Buy and sell can happen in the same day
+ Hold at most one stock
+ Multiple operations

**Intuition**
+ Capture All Uptrends: buy at every valley, sell at every peak
+ Avoid Overlapping Trade
  + Even it's possible stock increases for several day, but we should make use of the rule from the question

**Steps**
+ Iterate prices
  + Every increase is an oppotunity to make profit
  + Sum up all the increase

Time: O(N), Space: O(1)

#### [55. Jump Game](https://leetcode.com/problems/jump-game/)

+ Track the max reachable index
+ Iterate the jumps
  + If index > max reach -> return false
  + Update max reachable index from current index
  + If new max reachable index is over the total -> return true

#### [45. Jump Game II](https://leetcode.com/problems/jump-game-ii/)

+ The difference between this question and [Jump Game](#55-jump-game) is to **return the minimum jump**
+ **Greedy**: At each level, try to extend the jump range as far as possible
+ Steps:
  + Track the farthest index we can reach by `farthest`
  + Track the current range of jump by `currentRange`
  + When we reach `currentRange`, we must jump, so increase the `jump` counter, and update `currentRange`
+ **BE CAREFUL**: Iterate to the **second last index**, because as long as we can reach the second last index, we can jump

#### [383. Ransom Note](https://leetcode.com/problems/ransom-note/)

+ Use hash table to count occurrence of each letter
+ Knowing all the characters are letter, we can use array instead of hash table

#### [141. Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

+ Two pointer, slow and fast

### Intervals

#### [228. Summary Ranges](https://leetcode.com/problems/summary-ranges/)

+ Two pointer, one point to the range start, one is iterating
+ **Be creaful of the condition**

### Stack

### Binary Tree General

#### [104. Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)

+ Small tree use DFS, deep trees use **BFS**.

#### [100. Same Tree](https://leetcode.com/problems/same-tree/)

+ Try **BFS**

### Graph General

#### [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)

+ DFS. Traverse grid, mark (try to sink) visited cell

### Binary

#### [67. Add Binary](https://leetcode.com/problems/add-binary/)

+ Simulate binary addition (with two pointers)

---

## Meta Tagged Questions

### Binary Tree

#### [314. Binary Tree Vertical Order Traversal](https://leetcode.com/problems/binary-tree-vertical-order-traversal/)

**PROBLEM STATEMENT**

Given the `root` of a binary tree, return its vertical order traversal.
+ Nodes in the same vertical are ordered from top to bottom.
+ If multiple nodes are in the same position, they appear in left-to-right order.

**Keyword**: BFS

**Intuition**
+ Top to bottom, left to right, so use BFS
+ During BFS, track the column
+ `column = column_parent +/- 1`, and `root_column = 0`

**Approach**
```cpp
// Definition for a binary tree node.
// struct TreeNode {
//     int val;
//     TreeNode *left;
//     TreeNode *right;

//     TreeNode(int val = 0): TreeNode(val, nullptr, nullptr) {}
//     TreeNode(int x, TreeNode *left, TreeNode *right): val(x), left(left), right(right) {}
// };

// Intuition: BFS with column tracking
class Solution {
public:
    std::vector<std::vector<int>> verticalTraversal(TreeNode* root) {
        if (!root) {
            return {};
        }
        
        // We need a ordered map to store Column -> Nodes' value
        std::map<int, std::vector<int>> col_nodes;

        // For the BFS queue, we store Node -> Column
        std::queue<std::pair<TreeNode*, int>> q;
        q.push({root, 0});
        
        // BFS
        while (!q.empty()) {
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

Time: O($Nlog(N)$), Space: O(N)

#### [987. Vertical Order Traversal of a Binary Tree](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/)

**HARD**

**Keyword**: BFS

**Intuitions**
+ The different with [314. Binary Tree Vertical Order Traversal](#314-binary-tree-vertical-order-traversal) is that if there multiple nodes in the same row and same column, sort these nodes by their values.
+ We could reuse the same structure, but change `std::vector<int>` to `std::map<int, std::multiset<int>>`, meaning "row -> sorted nodes" 
+ Optionally we can use DFS with sorting

**Approach: DFS with Sorting**
+ DFS to traverse all nodes with (col, row)
+ Sort the nodes by, with the container of map<col, map<row, multiset<val>>>
  + Column(left->right)
  + Row(top->bottom)
  + Value(ascending)
+ Build the result

Time: O($Nlog(N)$), Space: O(N)

#### [236. Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

**Keyword**: DFS

**Steps**
+ DFS recursion
  + `p` and `q` are on different sides of the `node`, LCA is `node`
  + Either `p` or `q` on one side of the `node`, LCA should be in that side of the `node`
+ Use DFS on left and right

**Notes**
+ Even we can reuse the `lowestCommonAncestor()` function, its intention is confusing(we can't always find LCA in the subtree!), we better use a new `dfs()` function to define what to do in DFS recursion

#### [1644. Lowest Common Ancestor of a Binary Tree II](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-ii/)

**PROBLEM STATEMENT**

Given a binary tree, find the lowest common ancestor (LCA) of two given nodes `p` and `q`. However, this version of the problem has a special requirement:
+ If either `p` or `q` is missing from the tree, return `nullptr` instead of the LCA.

**Keyword**: DFS
```cpp
// Reuse the structure of basic LCA, but in dfs(), we carry the result if q and p exist in the tree, 
class Solution {
public:
    Node* lowestCommonAncestor(Node* root, Node* p, Node* q) {
        bool findP{false}, findQ{false};
        const auto lca = dfs(root, p, q, findP, findQ);
        return (findP && findQ) ? lca : nullptr;
    }

private:
    Node* dfs(Node* node, Node* p, Node* q, bool& findP, bool& findQ) {
        if (!node) {
            return nullptr;
        }
        
        bool leftFindP{false}, leftFindQ{false};
        const auto left = dfs(node->left, p, q, leftFindP, leftFindQ);
        bool rightFindP{false}, rightFindQ{false};
        const auto right = dfs(node->right, p, q, rightFindP, rightFindQ);

        findP = leftFindP || rightFindP || node == p;
        findQ = leftFindQ || rightFindQ || node == q;

        if (node == p || node == q) {
            return node;
        }
        if (left && right) {
            return node;
        }
        
        return left ? left : right;
    }
}
```

#### [1650. Lowest Common Ancestor of a Binary Tree III](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iii/)

**PROBLEM STATEMENT**

Given two nodes in a binary tree where each node contains a parent pointer, find their lowest common ancestor (LCA).

**Keyword**: Two-Pointer

**Steps**
+ Use two pointers, start at `p` and `q`
+ Move each pointer upward to its parent until they meet
+ If a pointer reaches the root (`parent = nullptr`), restart at the other node
  + Both pointers would traverse the same height in the end
+ The first common node encountered is the LCA

**Solution**
```cpp
// Node definition
// class Node {
//     int val;
//     Node* left;
//     Node* right;
//     Node* parent;
// };

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

Time: O(H), Space: O(1)

#### [199. Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view)

**Keyword**: BFS

**Intuition**
+ Because we need to iterate the tree by layer, so BFS
+ The last node is the right most node in current layer
+ Optional: DFS. Add the right node first, so when list size is same as the depth, that's the right most node

**Steps**
+ Classic BFS pattern, declare queue (of Node), push root, start loop
+ Track the last element in this layer
+ Insert left and right if neccessary

Time: O(N), Space: O(N)

**Variants**
+ Left Side View: Same structure, but save the first node of the layer

#### [543. Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/)

**Keyword**: DFS

**Intuition**
+ Diameter of a node is the longest path goes through the node
  + In other words, **the largest sum of left and right subtree height**
+ Because we need to calculate the height from bottom up, so use DFS

**Steps**
+ DFS recursion
  + Calculate the sum of left and right subtring height
  + Update the max diameter
  + Return height
+ Start recursion with root

Time: O(N), Space: O(H)

#### [863. All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/)

**MEDIUM BUT HARD!**

+ Because we need to go up and down, and the binary tree node doesn't have parent, so we **build a undirected graph from tree**
+ Use BFS to traverse the graph from target node to level `K`
+ Return the elements in level K

#### [124. Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/)

**HARD**

+ Traverse the tree with DFS, while tracking
  + The accumulate `maxSum` so far
  + The maxPath return to parent node (single path)
+ While traversing, ignore path has negative sum

#### [297. Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

**HARD**

+ We can use BFS to solver handle serialization and deserialization
+ Serialization
  + Check `node` is `nullptr` instead of `node->left` and `node->right`
+ Deserialization
  + Get familiar with `int std::getline(std::stringstream, std::string, char)`

### [129. Sum Root to Leaf Numbers](https://leetcode.com/problems/sum-root-to-leaf-numbers/)

**Keyword**: DFS

**Intuition**
+ Because we need to reach the leaf to build up a number, so DFS

**Steps**
+ DFS, while tracking the sum
  + Calculate current number
  + If meet leaf, return current number as sum
  + Else, return the sum of left and right node

Time: O(N), Space: O(H)

### Binary Search Tree(BST)

#### [938. Range Sum of BST](https://leetcode.com/problems/range-sum-of-bst/)

**Keyword**: DFS on DFS

**Steps**
+ DFS function: Return sum
  + If current val smaller than low, return sum of right branch
  + If current val larger than high, return sum of left branch
  + If current val in range, return the sum of left and rigth branches, and current value

Time: O(N), Space: O(H)

### String

#### [20. Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)

+ Use stack to hold the iterated characters
+ Closing bracket at the front, e.g. {'}', '{'}

#### [1249. Minimum Remove to Make Valid Parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses)

**Approach I: Two-Pass with Stack**
1. Use stack to store '(', and unordered_set for invalid indices for quick access
2. 1st pass: locate the unpaired ')' indices
3. 2nd pass: Add the left '(' (unpaired) indices into invalid indices
4. Build new string by removing invalid indices

Time: O(N), Space: O(N)

#### [921. Minimum Add to Make Parentheses Valid](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/)

**Approach: Simulate Stack**
+ Traverse from left to right
+ When encountering '(', increase left counter
+ When encountering ')'
  + There's '(' left, decrease counter
  + Otherwise, increase right counter 

#### [408. Valid Word Abbreviation](https://leetcode.com/problems/valid-word-abbreviation/)

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
**Keyword**: Two-Pointer

**Solution**

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
                while (j < abbr.size() && std::isdigit(abbr[j])) {
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

Time: O(len(word) + len(abbr)), Space: O(1)

### [791. Custom Sort String](https://leetcode.com/problems/custom-sort-string/)

**Intuition**
+ `order` has less character, and it defines the order, so build final string from `order` based on `s` frequency

**Steps**
+ Declare hash map to count occurance in `s`
+ Count occurance
+ Build result by iterating through `order`
+ Append the remaining letters at the end

Time: O(N), Space: O(N)

### [215. Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Approach I: Sort**
+ Sort the array in descending order
+ Return kth element

Time: O($Nlog(N)$), Space: O(1). Good for small N

**Approach II: Min Heap**
+ Define min heap to maintain the k largest elements
+ Iterate array
  + Pop (the smallest) when the heap size exceeds k
+ Return the top element

Time: O($Nlog(K)$), Space: O(K). Good for big K, or streaming data

**Approach III: Quickselect**

TODO

Time: O(N) average, O($N^2$) worst, Space: O(1)

### [227. Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/)

**Keyword**: Stack

**Intuition**
+ If there are only '+' and '-', then process the numbers in sequence
+ But we have '*' and '/', upcoming number should be processed immediately
+ So we use stack to achieve this

**Steps**
+ Iterate the string while tracking the current number and last operator
  + If digit, convert to number
  + If operator, or last digit
    + +: Push number to stack
    + -: Push neg number to stack
    + *: Calculate stack.top() * num, pop, and push result
    + /: Calculate stack.top() / num, pop, and push result
    + Update last operator, clear number
+ Sum up the elements in stack

Time: O(N), Space: O(N)

### [528. Random Pick with Weight](https://leetcode.com/problems/random-pick-with-weight/)

**Keyword**: Prefix Sum, Binary Search

**Intuition**
+ Prefix sum can map the range into prefix sum array
+ Use binary search to quickly find the valid index

**Steps** 
+ Build a prefix sum array, and total sum) from the input array in constructor
+ Pick random value x between [1, total]
+ Use binary search to find the lowerbound where prefixSum[i] >= x

**Note**

How to randomly pick a number in a range with modern C++?
```cpp
std::rndom_device rd;
std::mt19937 rng{rd()};
std::uniform_int_distribution<int> dist{kLow, kHigh};
auto num = dist(rd);a
```

### [162. Find Peak Element](https://leetcode.com/problems/find-peak-element/)

**IMPORTANT!!!**

**Keyword**: Binary Search

**Intuition**
+ We are guaranteed to find a peak, and we can return any peak.
+ Use binary search

**Steps**
+ Start at `0` and `n-1`
+ Loop, condition: Not cross (left < right)
  + Calculate `mid`, and compare `nums[mid]` and `nums[mid+1]`
    + `nums[mid]` > `nums[mid+1]`, move `right` to `mid`
    + `nums[mid]` < `nums[mid+1]`, move `left` to `mid + 1`
+ Return left (because `left == right` in the end)

Time: O($log(N)$), Space: O(1)

### [50. Pow(x, n)](https://leetcode.com/problems/powx-n/)

**Keyword**: Divide and Conquer

**Observations**
+ If n is even, $x^n = (x^2)^{n/2}$
+ If n is odd, $x^n = x \times x^{n-1}$

**Steps**
+ Corner case n == 0, return 1
+ Inverse `x` and `n`, if the exponent is negative
  + Be careful, range of `int` is $[-2^{31} - 1, 2^{31}]$, so $[2^{31} + 1]$ would overflow, either use `long long`, or calculate $x * myPow(x, -(n + 1))$
+ Use recursive/iteration. 
  + If `n` is even, $x^n = (x^2)^{n / 2}$
  + If `n` is odd, $x^n = x * x^{n-1}$

Time: O($Log(N)$), Space: recursive O($Log(N)$); Iteration: O(1)

### [71. Simplify Path](https://leetcode.com/problems/simplify-path/)

**Keyword**: Stack

**Observations**
+ Similar to [227. Basic Calculator II](#227-basic-calculator-ii)

**Steps**
+ Split the input path with '/'
  + Use `std::getline()`
+ Process each part
  + "." and "" -> ignore
  + ".." -> move up one by pop stack
  + Other are valid name, push stack
+ Build output string. 
  + Always startsWith '/', try not to use condition in the loop

Time: O(N), Space: O(N)

### [1091. Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)

**Keyword**: BFS

**Intuition**
+ Since we want to find a shortest path, use BFS
+ Explore 8 directions
+ Track visited nodes to avoid cycles

**Steps**
+ If the top-left or bottom-right cell is 1, return false
+ Element in BFS queue is [row, col], 
  + Push root
  + Update grid to visited
  + Init length to 1
+ BFS Loop
  + Iterate each layer (8 directions)
    + If reach bottom-right, return length
    + Try all 8 directions
      + If still in bound, and not visited
        + Push into layer
        + Update visited
  + Increase path
+ Default not found, return -1

Time: O($N^2$), Space: O($N^2$), Worst case: visit all the nodes

### [1570. Dot Product of Two Sparse Vectors](https://leetcode.com/problems/dot-product-of-two-sparse-vectors/)

**PROBLEM STATEMENT**

Given two sparse vectors, implement their dot product efficiently.

A sparse vector contains mostly 0s, so storing and computing all elements naively is inefficient.

Implement a class `SparseVector` with:

+ Constructor: `SparseVector(vector<int>& nums)`
+ Dot product function: `int dotProduct(SparseVector& vec)`

**Keyword**: Two-Pointer

**Intuition**
+ Store the SparseVector as list of non-zero numbers' index and value
+ Use two pointers to iterate both SparseVector

**Solution**
```cpp
class SparseVector {
public:
    // Store Non-Zero element: {index: value}
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

### [125. Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)

**Keyword**: Two-Pointer

**Steps**
+ Two pointers start from the start and end
+ Loop unitl `left` and `right` cross
  + Ignore the non-alnum characters on both sides
  + Convert to lowercase and compare
  + Move closer

Time: O(N), Space: O(1)

### [680. Valid Palindrome II](https://leetcode.com/problems/valid-palindrome-ii/)

**Keyword**: Two-Pointer

**Approach: Two Pointer with (at most) one skip**
+ Write a function to check if a string between range is palindrome
+ Two pointers start from the start and end
+ Loop unitl `left` and `right` cross
  + If not match, try to move either `left` or `right`
  + Move closer

Time: O(N), Space: O(1)

### [647. Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/)

**Keyword**: Two-Pointer

**Steps**
+ Expand string from center of each character, and count valid palindrome
  + Consider both odd number (`i, i`) and even number (`i, i + 1`)

Time: O($N^2$), Space: O(1)

### [560. Subarray Sum Equals K](https://leetcode.com/problems/subarray-sum-equals-k/)

**Keyword**: Prefix Sum

**Intuition**
+ Because we want to find _subarray_ sum, think of prefix sum
  + If $sum[j] - sum[i] = k$, then subarray `nums[i+1: j]` sums to k

**Steps**
+ Use a hash table to store Prefix Sum Value -> Indices Count
  + Base case: Prefix 0 occurs once
+ Iterate numbers
  + If find `Current prefix sum - k` in the hash table, accumulate count
  + Update Prefix Sum hash table

Time: O(N), Space: O(N)

### [116. Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/)

+ Use BFS, traverse from top to bottom, left to right, ignore the right most node in each layer
+ Make use of `next` pointer. Two while loop, outer use leftMost, inner use head

### [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/)

**Keyword**: Intervals

**Steps**
+ Sort the input intervals **by the mins**
+ Iterate the sorted intervals and merge based on overlapping between the last interval in result and the current interval

Time: O(NLog(N)), Space: O(N)

### [146. LRU Cache](https://leetcode.com/problems/lru-cache)

 **Keyword**: Linked-List

 **Observations**
 + Both `get()` and `put()` are considered "used", So we use doubly linked list for efficient ordering
 + We can't use index to manipulate value in linked list, so we create a hash map {key, iterator}

**Steps**
+ Declare a doubly linked list for the main underlying container
+ Declare a hash map {key, iterator} to fast access data
+ `get()`
  + If not exist in map, return -1
  + If exist
    + Use the iterator to get value
    + Remove the iterator
    + Push new node to the front
    + Update map
+ `put()`
  + If exist in map
    + Use iterator to remove
    + Push new node to the front
    + Update map
  + If not exist
    + If exceed
      + Get the last key
      + Pop last element
      + Remove from map
      + Push new node to the front
      + Update map
    + If not exceed
      + Push new node to the front
      + Update map

Time: O(1), Space: O(N)

### [347. Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements)

**Keyword**: Min-Heap

**Steps**
+ Use hashtable to store the frequency
+ Use min heap to track top k largest elements (pop when size exceeds k)
+ Build results

Time: O(NLog(K)), Space: O(N)

### [973. K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)

**Keyword**: Max-Heap

**Intuition**
+ "K Closest Points to Origin", meaning the smallest K distances, use max heap

**Steps: Max-Heap**
+ Declare max heap: Element is [distance -> point]
+ Iterate points
  + Push new distance
  + If exceed k, pop heap

Time: O(NLog(K)), Space: O(K)

**Steps: Quick-Select**
+ Use std::nth_element

Time: O(N) for average, O($N^2$), Space: O(1)

### [1762. Buildings With an Ocean View](https://leetcode.com/problems/buildings-with-an-ocean-view/)

**PROBLEM STATEMENT**

There are `n` buildings in a row, indexed from `0` to `n-1`. Each building has a height represented by `heights[i]`.

A building has an ocean view if all buildings to its right have a smaller height.

Return a list of indices of buildings that have an ocean view in increasing order.

**Observations**
+ Start from the rightmost building, which guaranteed ocean view.

**Steps**
+ Iterate from the right, and track the so far tallest
  + If `newHeight > maxHeight`, update max, save index
+ Reverse result

**Solution**
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

Time: O(N), Space: O(1)

### [986. Interval List Intersections](https://leetcode.com/problems/interval-list-intersections/)

**Keyword**: Two-Pointer

**Steps**
+ Declare two pointers, start from the begining
+ Loop
  + An intersection exists if $max(start_1, start_2) \leq min(end_1, end_2)$
  + Move the pointer from the list where the interval ends first (smaller ending).

Time: O(N+M), Space: O(1)

### [138. Copy List with Random Pointer](https://leetcode.com/problems/copy-list-with-random-pointer/)

**WARNING**

**Intuition**
+ The easiest way is to use an extra hash map to store {Old Node -> New Node}
  + 1st pass: Create the mapping from {Old Node -> New Node}
  + 2nd pass: Based on the hash map, link the new nodes
+ The optimal solution is not easy to come up

**Approah: Interleaving**
+ 1st pass: Copy each node right after the original node (don't care random pointer)
+ 2nd pass: Link random pointer in the copied nodes
+ 3rd pass: Separate the copied nodes and original nodes, and recover the original nodes links.
  + Use dummy header

Time: O(N), Space: O(1)

### [23. Merge k Sorted Lists](https://leetcode.com/problems/merge-k-sorted-lists/)

**Keyword**: Min-Heap

**Steps**
+ Declare a min heap
+ Iterate lists, insert starting nodes into min heap, so smallest node starts first
+ Use dummy node
+ Loop
  + Pop the smallest (pop)
  + Link to this node
  + Move to this node
  + Push to current next (if there is)
+ Return dummy's next

Time: O(NLog(K)), Space: O(k)

### [339. Nested List Weight Sum](https://leetcode.com/problems/nested-list-weight-sum/)

**PROBLEM STATEMENT**

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

**Keyword**: DFS

```cpp
#include <vector>

// LeetCode provided interface
class NestedInteger {
public:
    bool isInteger() const;
    int getInteger() const;
    const std::vector<NestedInteger>& getList() const;
}

// DFS
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

### [346. Moving Average from Data Stream](https://leetcode.com/problems/moving-average-from-data-stream/)

**PROBLEM STATEMENT**

You need to implement a class `MovingAverage` that calculates the moving average of the last `size` elements in a data stream.

**Keyword**: Sliding Window

**Intuition**
+ Classic sliding window, use queue
+ Track current sum while manipulating(add/remove) data

**Solution**
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

        return sum / q.size();
    }

private:
    std::queue<int> _q;
    double _sum;
    const int _size;
}
```

Time: O(1), Space: O(capacity)

### [282. Expression Add Operators](https://leetcode.com/problems/expression-add-operators/)

**HARD!!!**

### [670. Maximum Swap](https://leetcode.com/problems/maximum-swap/)

**Keyword**: Greedy

**Observations**
+ Swap **at most once**
+ Find the largest to the right and swap with first decreasing digit

**Steps**
+ Convert the number to string
+ Declare a std::array to store _last occured index of digit_
+ Iterate string
  + From biggest digit (9) to current digit
    + If last occurred to the right (last occur index > i), swap and return

Time: O(N), Capacity: O(1)
  
### [31. Next Permutation](https://leetcode.com/problems/next-permutation/)

**DRAW EXAMPLE**

e.g. 24,857,631 -> 24,867,531 -> 24,861,357

+ Traverse from right to left to find the pivot where $nums[i] < nums[i-1]$
+ Traverse again from right to left to find the **smallest digit** larger than current `nums[i]`, then swap. This digit could be the new start
+ Reverse the sequence from `i+1` to the end

### [76. Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/)

**HARD**

**Keyword**: Two-Pointer, Sliding Window

**Intuition**
+ Count the frequency in `template`
+ Using sliding window to expand and contract as needed
+ Track how many characters have met required count

**Steps**
+ Declare template frequency map: {char -> int}
+ Count the frequency in `template`
+ Declare sliding window
  + Window frequency map: {char -> int}
  + Window start
  + Window length
+ Two pointers loop. `right` as expand iterator, `left` as contract iterator
  + Get current `right`, and move on (expand)
    + If this character is needed
      + Window frequency increase
      + If the frequency is same, match counter increase
  + If match counter is same as need (meaning we have all the characters, but frequency may not correct), try to contract
    + If current length is smaller, update min window length
    + Get current `left`, and move on (expand)
      + If this character is needed
        + If the frequency is same, match counter decrease
        + Window frequency decrease
+ Return substring

Time: O(len(string), len(template)), Space: O(len(template))

### Meeting Rooms

### [252. Meeting Rooms I](https://leetcode.com/problems/meeting-rooms/)

**PROBLEM STATEMENT**

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

#### [253. Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

**PROBLEM STATEMENT**

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
            // If current meeting starts after (larger than) the earliest ending time
            if (intervals[i][0] >= minHeap.top()) {
                minHeap.pop();
            }
            minHeap.push(intervals[i][1]);
        }

        return minHeap.size();
    }
}
```

#### [2402. Meeting Rooms III](https://leetcode.com/problems/meeting-rooms-iii/)

**HARD**

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

#### [1. Two Sums](https://leetcode.com/problems/two-sum/)

**Steps**
+ Use hashtable to store the visited value and its index
+ Iterate the numbers
  + If `target - nums[i]` exists in hashtable, append to result
  + Else insert new pair

#### [167. Two Sums II](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/)

+ The difference with previous question is input array is sorted
+ Use two pointers, starts from the beginning and end
+ If sum is less than `target`, move left; greater than `target` move right, or return index pair

#### [15. 3Sums](https://leetcode.com/problems/3sum/)

+ Sort the values
+ The rest is similar to [Two Sums II](#two-sums-ii)
+ Be careful about the duplicated numbers, skip them in the outer loop as well as the inner loop after find one combination


### [133. Clone Graph](https://leetcode.com/problems/palindromic-substrings/)

**Keyword**: DFS

**Intuition**
+ Use DFS to traverse the graph
+ Use one hash table to store cloned nodes {Old -> New} to avoid cycles
+ Cycles for graph is like leaf of tree but connected

**Steps**
+ The DFS function: Return cloned node, carrying (or cache) hash map
  + If `nullptr` return `nullptr`
  + If node is cloned, return the cloned node
  + Otherwise
    + Clone new node
    + Recursively clone its neigbor
+ Start DFS from `root`

Time: O(N + E), Space: O(N)

### [827. Making A Large Island](https://leetcode.com/problems/making-a-large-island/description/)

**HARD**

**Keywords**: DFS

**Intuition**
+ When we change a cell from sea into land, it also connect the neighbor lands together
+ Label all islands with unique ids, and save their size
  + ID should starts from 2, because 0 is for water, 1 is for OG land(a.k.a. unvisited land)
+ Try to turn each water into land, and calculate the new island size, update max island size
  + Use `set` to avoid duplicated

**Steps**
+ Declare hash map, {Island Id -> Island Size}
  + Id starts from 2
+ 1st pass: Iterate cells, use DFS calculate size. 
+ DFS function: return size, log visited (with Id), carry the Island size map
  + If not in bound, or not unvisited land, return 0
  + If in bound
    + Update Id
    + Explore 4 directions, (size from 1)
+ 2nd pass: Find current max island size
+ 3rd pass: Iterate cells, locate water and try to fill
  + Explore 4 directions, and add neighbor
  + Sum up to calculate new size
  + Update new max size

Time: O($N^2$), Space: O($N^2$)

### [1004. Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/)

**Keywords**: Sliding Windows

**Intuition**
+ The problem is equivalent to **find the widest window with at most `k` zeros**

**Steps**
+ Two pointers, iterate `right`, slide control with `left`
+ `zeroCount` to count zeros, `maxLen` to track current max length
+ Iterate numbers
  + If zero, count up
  + If more than `k` zeros in the window, move `left`
  + Update window length

Time: O(N), Space: O(1)

### [65. Valid Number](https://leetcode.com/problems/valid-number/description/)

**HARD**

**Intuition**
+ Nothing special, consider the following
  + Start with optional sign?
  + Integer or decimal?
  + Optional **exponent followed by an integer(even it's legit in math, not here)**

**Steps**
+ If start with sign, move on
+ Iterate the following
  + Is numberic? Log, and move on
  + Is dot? Met dot or exponent before? 
    + Yes -> Quit
    + No -> Log, and move on
  + Is exp? Met exponent or no numberic before?
    + Yes -> Quit
    + No -> Log, and **reset meet numberic**, and move on.
      + Move on if followed by a sign
  + Other -> Quit
+ Return Meet numberic or not

### [34. Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

**Keyword**: Binary search

**Intuition**
+ We can do a binary search to land in the target set, then expand outward
+ **BUT!!!** That works only when we know targets is a small cluster, The worst cast is that, all the values are target, then time complexity is O(N)
+ So a more general solution would be **binary search twice**, don't stop after we find the target, continue search left and right half

**Steps: Binary Search Twice**
+ Custom binary search
  + When target is found
    + If want to find low bound, `right = mid - 1`
    + If want to find high bound, `left = mid + 1`
  + We could even use template


```cpp
template<bool _isLow>
int findBound(const std::vector<int>& nums, int target) {
    ...
}

// Use case
constexpr auto kLow{true};
constexpr auto kHigh{false};
// ...
if constexpr (kLow) {
    right = mid - 1;
} else {
    left = mid + 1;
}
// ...
return {findBound<kLow>(...), findBound<kHigh>(...)};
```

### [249. Group Shifted Strings](https://leetcode.com/problems/group-shifted-strings/)

**PROBLEM STATEMENT**

We are given an array of strings. Two strings are shifted versions of each other if:
+ You can shift each character in one string by the same number of positions in the alphabet to get the other string.
+ For example, "abc" → "bcd" → "cde" are all shifted versions.
+ More example, "ace" → "ceg"

Task: Group all strings that are shifted versions of each other.

**Intuition**
+ All the strings in a same group share same "pattern"
+ "Shift pattern" can be calculated by a vector of shift from the first character
  + "abc" -> `[1, 1](by b-a, c-b)`
  + "bcd" -> `[1, 1](by c-b, d-c)`
+ We can make it more robust, if we shift all the strings to "a"

```cpp
class Solution {
public:
    std::vector<std::vector<std::string>> groupStrings(const std::vector<std::string>& strings) {
        std::unordered_map<std::string, std::vector<std::string>> patternToStrings;
        for (const auto& str: strings) {
            const auto pattern = calcPattern(str);
            patternToStrings[pattern].push_back(str);
        }

        std::vector<std::vector<std::string>> res;
        for (const auto& [_, strings]: patternToStrings) {
            res.push_back(strings);
        }
        return res;
    }

private:
    std::string calcPattern(const std::string& s) {
        // Normalize to start from 'a'
        const auto shift = s[0] - 'a';
        std::string pattern;
        for (const auto& ch: s) {
            // Normalize -> calculate diff -> convert to char
            pattern += (ch - shift + 26) % 26 + 'a';
        }
        return pattern;
    }

}
```

### [19. Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

**Keyword**: Two-Pointer

**Intuition**
+ For singly linked link, we can't access element by index, instead we have to count the move.
+ The distance between the earlier pointer and the later pointer keeps constant

**Steps**
+ `first` and `second` pointer start from `dummy` node
+ Move `first` for `n+1` steps forward
+ Then move both together until `first` hits the end
+ `second->next` is the one to remove

**Note**
+ Why `dummy` node?
+ Why move `n+1` steps?
  + To remove the nth from the end, we need to arrive at the one before last nth node
  + The `first` pointer stops at pos n

### [282. Expression Add Operators](https://leetcode.com/problems/expression-add-operators/)

**HARD**

### [498. Diagonal Traverse](https://leetcode.com/problems/diagonal-traverse/)

**Observation**
+ The `row + col` of element on diagonal is the same.
  + Origin at top left corner, x-axis to leftward, y-axis downward so diagonal is y = -x + k
+ There are in total `m + n - 1` directions (Easy to visualize)

**Steps**
+ Iterate `m + n - 1` directions, **from top to bottom, left to right**
  + If even, go up-right
    + Locate start point (left/bottom edge), move
  + If odd, go down-left
    + Locate start point (right/top edge), move

**Note**
+ How to understand `d`? e.g. $m=5, n=7$

```math
\begin{matrix}
0 & 1 & 2 & 3 & 4 & 5 & 6 \\
1 & 2 & 3 & 4 & 5 & 6 & 7 \\
2 & 3 & 4 & 5 & 6 & 7 & 8 \\
3 & 4 & 5 & 6 & 7 & 8 & 9 \\
4 & 5 & 6 & 7 & 8 & 9 & 10
\end{matrix}
```

### [1539. Kth Missing Positive Number](https://leetcode.com/problems/kth-missing-positive-number/)

**Keyword**: Binary search

**Observations**
+ For index `i`, the num of missing number before arr[i] is `arr[i] - i - 1`
  + If no missing, number `arr[i]` should be at index `arr[i] - 1`, but now at index `i`, so missing `arr[i] - i - 1`
+ We could use line scan. In case of large n, we use binary search

**Steps**
+ `left` at 0, `right` at n
+ Calculate `mid`, and missing at `mid`
  + If less than `k`, move `left`
  + Else, move `right`

**Notes**
+ `while` condition, and how to update `left` and `right`

### [708. Insert into a Sorted Circular Linked List](https://leetcode.com/problems/insert-into-a-sorted-circular-linked-list/)

**PROBLEM STATEMENT**

### [636. Exclusive Time of Functions](https://leetcode.com/problems/exclusive-time-of-functions/)

**Keyword**: Stack

**Steps**
+ Write a log parser
+ Iterate the logs while tracking the previous timestamp to know how much time the top function on the stack run since last event
  + If it's a "start", push into the stack, calculate the running time of current function (if there's any), update `prevTime`
  + If it's a "start", calculate the running time of current function, and pop stack, update `prevTime`

Time: O(N), Space: O(N)

### [523. Continuous Subarray Sum](https://leetcode.com/problems/continuous-subarray-sum/)

**Keyword**: Prefix Sum

**Intuition**
+ "Subarray sum", probably use prefix sum
+ `sum[i:j] = sum[j] - sum [i]` is divisible by `k`, that means `sum[i] % k == sum[j] % k`

**Steps**
+ Use a hash table to store the Index -> mod
  + Remember to add edge case {0: -1} **!!!**
+ Iterate the array
  + If `mod % k` in the hash table
    + Yes, return if the distance is more than 2
    + No, insert result

Time: O(N), Space: O(N)

### [270. Closest Binary Search Tree Value](https://leetcode.com/problems/closest-binary-search-tree-value/)

**PROBLEM STATEMENT**

### [426. Convert Binary Search Tree to Sorted Doubly Linked List](https://leetcode.com/problems/convert-binary-search-tree-to-sorted-doubly-linked-list/)

**PROBLEM STATEMENT**

### [14. Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/)

**Steps**
+ Use the first string as reference to scan column
+ Iterate character
  + Compare to all other strings
    + If not the same or too small, return current substring

### [207. Course Schedule](https://leetcode.com/problems/course-schedule/)

### [721. Accounts Merge](https://leetcode.com/problems/accounts-merge/)

### [398. Random Pick Index](https://leetcode.com/problems/random-pick-index/)

### [415. Add Strings](https://leetcode.com/problems/add-strings/)

### [824. Goat Latin](https://leetcode.com/problems/goat-latin/)

### [1768. Merge Strings Alternately](https://leetcode.com/problems/merge-strings-alternately/)

### [219. Contains Duplicate II](https://leetcode.com/problems/contains-duplicate-ii/)

### [173. Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/)

### [224. Basic Calculator](https://leetcode.com/problems/basic-calculator/)

### [4. Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)

### [1047. Remove All Adjacent Duplicates In String](https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/)

### [3. Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/)
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
