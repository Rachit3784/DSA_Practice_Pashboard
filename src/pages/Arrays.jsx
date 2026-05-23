import { useState, useMemo, useEffect, useCallback } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Sun, Moon } from "lucide-react";

/* ─────────────────────────── STORAGE HELPER ─────────────────────────── */
const LS_KEY = "dsa_solved_v3";
const loadSolved = () => {
  try { return new Set(JSON.parse(localStorage.getItem(LS_KEY) || "[]")); }
  catch { return new Set(); }
};
const saveSolved = (set) => {
  try { localStorage.setItem(LS_KEY, JSON.stringify([...set])); } catch {}
};

/* ─────────────────────────── COLOUR HELPERS ─────────────────────────── */
const diffClasses = (d) =>
  d === "Easy"   ? "badge badge-easy"
  : d === "Medium" ? "badge badge-medium"
  : "badge badge-hard";

const patColor = (p) => {
  const m = {
    "Two Pointer":"cyan","Sliding Window":"violet","Prefix Sum":"yellow",
    "Binary Search":"blue","Kadane's":"orange","Dutch Flag":"pink",
    "Monotonic Stack":"indigo","Cyclic Sort":"teal","HashMap":"rose",
    "Greedy":"lime","DP":"fuchsia","Sorting":"sky","Divide & Conquer":"amber",
    "Matrix":"purple","Bit Manipulation":"green","String":"emerald",
    "Boyer-Moore":"red","BFS/DFS":"slate",
  };
  return m[p] || "slate";
};

/* ═══════════════════════════════════════════════════════════════════════
   MASTER QUESTION DATABASE  (Arrays + 2D Arrays + Strings)
   Sources: LeetCode, GFG Amazon tag, Striver A2Z, Love Babbar 450,
            Coding Ninjas, InterviewBit
═══════════════════════════════════════════════════════════════════════ */


const QUESTIONS = [

/* ══════════════ SECTION 1 — 1D ARRAYS ══════════════ */

{id:1,num:"LC#1",name:"Two Sum",cat:"1D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"HashMap",algo:"Hash Table",tags:["hashmap"],
 concept:"Store complement in map. For each num check if target-num already seen. O(n) single pass.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++)
        for (int j = i+1; j < nums.length; j++)
            if (nums[i]+nums[j] == target) return new int[]{i,j};
    return new int[]{};
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int[] twoSum(int[] nums, int target) {
    Map<Integer,Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int comp = target - nums[i];
        if (map.containsKey(comp)) return new int[]{map.get(comp), i};
        map.put(nums[i], i);
    }
    return new int[]{};
}`,note:"One pass. Check complement BEFORE inserting to handle duplicates correctly."}},

{id:2,num:"LC#53",name:"Maximum Subarray (Kadane's)",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Kadane's",algo:"Kadane's Algorithm",tags:["dp","kadane"],
 concept:"At each index: extend subarray OR restart fresh. curr=max(arr[i], curr+arr[i]).",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int maxSubArray(int[] nums) {
    int max = Integer.MIN_VALUE;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            max = Math.max(max, sum);
        }
    }
    return max;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int maxSubArray(int[] nums) {
    int maxSoFar = nums[0], curr = nums[0];
    for (int i = 1; i < nums.length; i++) {
        curr = Math.max(nums[i], curr + nums[i]);
        maxSoFar = Math.max(maxSoFar, curr);
    }
    return maxSoFar;
}`,note:"curr negative → past subarray is a drag → restart. Works with all negatives."}},

{id:3,num:"LC#121",name:"Best Time to Buy and Sell Stock I",cat:"1D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Greedy",algo:"Running Minimum",tags:["greedy"],
 concept:"Track running minimum price. At each price: profit = price − minSoFar. One pass.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int maxProfit(int[] prices) {
    int max = 0;
    for (int i = 0; i < prices.length; i++)
        for (int j = i+1; j < prices.length; j++)
            max = Math.max(max, prices[j]-prices[i]);
    return max;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE, maxProfit = 0;
    for (int p : prices) {
        minPrice = Math.min(minPrice, p);
        maxProfit = Math.max(maxProfit, p - minPrice);
    }
    return maxProfit;
}`,note:"minPrice is the 'buy day'. Update profit at every possible 'sell day'."}},

{id:4,num:"LC#42",name:"Trapping Rain Water",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Two Pointer",algo:"Two Pointer / Prefix Max Arrays",tags:["two-pointer","prefix"],
 concept:"Water at i = min(maxLeft, maxRight) − height[i]. Two-pointer: process from the shorter side — it's bounded.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int trap(int[] h) {
    int water = 0, n = h.length;
    for (int i = 1; i < n-1; i++) {
        int lMax = 0, rMax = 0;
        for (int j = 0; j <= i; j++) lMax = Math.max(lMax, h[j]);
        for (int j = i; j < n; j++) rMax = Math.max(rMax, h[j]);
        water += Math.min(lMax, rMax) - h[i];
    }
    return water;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int trap(int[] h) {
    int lo=0, hi=h.length-1, lMax=0, rMax=0, water=0;
    while (lo <= hi) {
        if (h[lo] <= h[hi]) {
            lMax = Math.max(lMax, h[lo]);
            water += lMax - h[lo];
            lo++;
        } else {
            rMax = Math.max(rMax, h[hi]);
            water += rMax - h[hi];
            hi--;
        }
    }
    return water;
}`,note:"When h[lo]<=h[hi], left side is the bottleneck regardless of what's between."}},

{id:5,num:"LC#84",name:"Largest Rectangle in Histogram",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Monotonic Stack",algo:"Monotonic Stack",tags:["stack","monotonic"],
 concept:"Monotonic increasing stack. When smaller bar seen, pop and calculate area. Width = i - stack.peek() - 1. Sentinel 0 at end flushes all.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int largestRectangleArea(int[] heights) {
    int max = 0, n = heights.length;
    for (int i = 0; i < n; i++) {
        int minH = heights[i];
        for (int j = i; j < n; j++) {
            minH = Math.min(minH, heights[j]);
            max = Math.max(max, minH * (j - i + 1));
        }
    }
    return max;
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int largestRectangleArea(int[] heights) {
    Deque<Integer> stack = new ArrayDeque<>();
    int max = 0, n = heights.length;
    for (int i = 0; i <= n; i++) {
        int cur = (i == n) ? 0 : heights[i];
        while (!stack.isEmpty() && cur < heights[stack.peek()]) {
            int h = heights[stack.pop()];
            int w = stack.isEmpty() ? i : i - stack.peek() - 1;
            max = Math.max(max, h * w);
        }
        stack.push(i);
    }
    return max;
}`,note:"Sentinel 0 at end forces processing all remaining bars. Width: if stack empty, extends to index 0."}},

{id:6,num:"LC#560",name:"Subarray Sum Equals K",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Prefix Sum",algo:"Prefix Sum + HashMap",tags:["prefix-sum","hashmap"],
 concept:"If prefixSum[j]-prefixSum[i]=k then subarray [i+1..j] has sum k. Init map {0:1}. Works with negatives.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int subarraySum(int[] nums, int k) {
    int count = 0;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            if (sum == k) count++;
        }
    }
    return count;
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int subarraySum(int[] nums, int k) {
    Map<Integer,Integer> map = new HashMap<>();
    map.put(0, 1);
    int count = 0, prefix = 0;
    for (int n : nums) {
        prefix += n;
        count += map.getOrDefault(prefix - k, 0);
        map.merge(prefix, 1, Integer::sum);
    }
    return count;
}`,note:"SLIDING WINDOW DOES NOT WORK HERE (negatives present). Always use prefix+HashMap for subarrays with negatives."}},

{id:7,num:"LC#238",name:"Product of Array Except Self",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Prefix Sum",algo:"Prefix × Suffix Product",tags:["prefix","suffix"],
 concept:"Pass1: result[i]=product of all left elements. Pass2: multiply suffix products from right. No division. O(1) extra.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    for (int i = 0; i < n; i++) {
        int prod = 1;
        for (int j = 0; j < n; j++) if (j != i) prod *= nums[j];
        res[i] = prod;
    }
    return res;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] res = new int[n];
    res[0] = 1;
    for (int i = 1; i < n; i++) res[i] = res[i-1] * nums[i-1];
    int suffix = 1;
    for (int i = n-1; i >= 0; i--) {
        res[i] *= suffix;
        suffix *= nums[i];
    }
    return res;
}`,note:"Output array is not counted as extra space. suffix variable avoids O(n) suffix array."}},

{id:8,num:"LC#15",name:"3Sum",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Two Pointer",algo:"Sort + Two Pointer",tags:["two-pointer","sorting"],
 concept:"Sort. Fix nums[i], two-pointer on rest. Skip duplicates at all 3 pointer positions carefully.",
 brute:{tc:"O(n³)",sc:"O(n)",code:`List<List<Integer>> threeSum(int[] nums) {
    Set<List<Integer>> set = new HashSet<>();
    for (int i = 0; i < nums.length; i++)
        for (int j = i+1; j < nums.length; j++)
            for (int k = j+1; k < nums.length; k++)
                if (nums[i]+nums[j]+nums[k] == 0) {
                    List<Integer> t = Arrays.asList(nums[i],nums[j],nums[k]);
                    Collections.sort(t); set.add(t);
                }
    return new ArrayList<>(set);
}`},
 optimal:{tc:"O(n²)",sc:"O(1)",code:`List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < nums.length-2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int lo = i+1, hi = nums.length-1;
        while (lo < hi) {
            int sum = nums[i]+nums[lo]+nums[hi];
            if (sum == 0) {
                res.add(Arrays.asList(nums[i],nums[lo],nums[hi]));
                while (lo<hi && nums[lo]==nums[lo+1]) lo++;
                while (lo<hi && nums[hi]==nums[hi-1]) hi--;
                lo++; hi--;
            } else if (sum < 0) lo++;
            else hi--;
        }
    }
    return res;
}`,note:"Duplicate skipping is crucial. Sort enables two-pointer reduction from O(n³) to O(n²)."}},

{id:9,num:"LC#11",name:"Container With Most Water",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Two Pointer",algo:"Greedy Two Pointer",tags:["two-pointer","greedy"],
 concept:"Always move the SHORTER line inward. Proof: moving taller can only decrease width while min height stays same or worse.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int maxArea(int[] h) {
    int max = 0;
    for (int i = 0; i < h.length; i++)
        for (int j = i+1; j < h.length; j++)
            max = Math.max(max, (j-i) * Math.min(h[i], h[j]));
    return max;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int maxArea(int[] height) {
    int lo=0, hi=height.length-1, max=0;
    while (lo < hi) {
        max = Math.max(max, (hi-lo) * Math.min(height[lo], height[hi]));
        if (height[lo] < height[hi]) lo++;
        else hi--;
    }
    return max;
}`,note:"Area = width × min(heights). Moving shorter side is the only chance to find better area."}},

{id:10,num:"LC#33",name:"Search in Rotated Sorted Array",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","Coding Ninjas"],
 pattern:"Binary Search",algo:"Modified Binary Search",tags:["binary-search","rotated"],
 concept:"One half is ALWAYS sorted. Identify sorted half → check if target in it → recurse there, else other side.",
 brute:{tc:"O(n)",sc:"O(1)",code:`int search(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) if (nums[i] == target) return i;
    return -1;
}`},
 optimal:{tc:"O(log n)",sc:"O(1)",code:`int search(int[] nums, int target) {
    int lo=0, hi=nums.length-1;
    while (lo <= hi) {
        int mid = lo+(hi-lo)/2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) {
            if (target >= nums[lo] && target < nums[mid]) hi = mid-1;
            else lo = mid+1;
        } else {
            if (target > nums[mid] && target <= nums[hi]) lo = mid+1;
            else hi = mid-1;
        }
    }
    return -1;
}`,note:"Key insight: at EVERY step one half is always monotonically sorted in a rotated sorted array."}},

{id:11,num:"LC#153",name:"Find Minimum in Rotated Sorted Array",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Binary Search",algo:"Binary Search",tags:["binary-search","rotated"],
 concept:"If nums[mid] > nums[hi], minimum is in right half. Else in left half (mid could be min, don't exclude).",
 brute:{tc:"O(n)",sc:"O(1)",code:`int findMin(int[] nums) {
    int min = nums[0];
    for (int n : nums) min = Math.min(min, n);
    return min;
}`},
 optimal:{tc:"O(log n)",sc:"O(1)",code:`int findMin(int[] nums) {
    int lo=0, hi=nums.length-1;
    while (lo < hi) {
        int mid = lo+(hi-lo)/2;
        if (nums[mid] > nums[hi]) lo = mid+1;
        else hi = mid;
    }
    return nums[lo];
}`,note:"Compare mid with hi (not lo). When mid>hi, the drop is between mid and hi."}},

{id:12,num:"LC#75",name:"Sort Colors (Dutch National Flag)",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Dutch Flag",algo:"Three-Way Partition",tags:["three-pointer"],
 concept:"lo(0s zone end), mid(current), hi(2s zone start). One pass. CRITICAL: don't increment mid after swapping with hi.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`void sortColors(int[] nums) {
    int c0=0, c1=0, c2=0;
    for (int n : nums) { if(n==0)c0++; else if(n==1)c1++; else c2++; }
    int i=0;
    while(c0-->0) nums[i++]=0;
    while(c1-->0) nums[i++]=1;
    while(c2-->0) nums[i++]=2;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`void sortColors(int[] nums) {
    int lo=0, mid=0, hi=nums.length-1;
    while (mid <= hi) {
        if (nums[mid] == 0) { swap(nums, lo++, mid++); }
        else if (nums[mid] == 1) { mid++; }
        else { swap(nums, mid, hi--); }
    }
}`,note:"BUG TRAP: when swapping with hi, the element from hi is unseen — must NOT increment mid."}},

{id:13,num:"LC#128",name:"Longest Consecutive Sequence",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"HashMap",algo:"HashSet",tags:["hashset"],
 concept:"Only start counting from sequence beginnings (n-1 not in set). Then count forward. O(n) total.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`int longestConsecutive(int[] nums) {
    Arrays.sort(nums);
    int best=1, curr=1;
    for (int i=1; i<nums.length; i++) {
        if (nums[i] == nums[i-1]) continue;
        if (nums[i] == nums[i-1]+1) curr++;
        else curr=1;
        best = Math.max(best, curr);
    }
    return nums.length==0 ? 0 : best;
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    int best = 0;
    for (int n : set) {
        if (!set.contains(n-1)) {
            int curr = n, len = 1;
            while (set.contains(curr+1)) { curr++; len++; }
            best = Math.max(best, len);
        }
    }
    return best;
}`,note:"set.contains(n-1) check prevents counting from middle of sequence."}},

{id:14,num:"LC#56",name:"Merge Intervals",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Sorting",algo:"Sort + Greedy Merge",tags:["sorting","greedy"],
 concept:"Sort by start. If current.start <= last.end → overlap → extend end. Else add new interval.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int[][] merge(int[][] intervals) {
    List<int[]> res = new ArrayList<>(Arrays.asList(intervals));
    boolean merged = true;
    while (merged) {
        merged = false;
        for (int i = 0; i < res.size()-1; i++) {
            if (res.get(i)[1] >= res.get(i+1)[0]) {
                res.get(i)[1] = Math.max(res.get(i)[1], res.get(i+1)[1]);
                res.remove(i+1); merged = true; break;
            }
        }
    }
    return res.toArray(new int[0][]);
}`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a,b) -> a[0]-b[0]);
    List<int[]> res = new ArrayList<>();
    for (int[] curr : intervals) {
        if (!res.isEmpty() && curr[0] <= res.get(res.size()-1)[1])
            res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], curr[1]);
        else res.add(curr);
    }
    return res.toArray(new int[0][]);
}`,note:"Sort by start guarantees overlapping intervals are adjacent. Two intervals overlap if b.start <= a.end."}},

{id:15,num:"LC#57",name:"Insert Interval",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Sorting",algo:"Three-Phase Linear Scan",tags:["sorting","greedy"],
 concept:"Three phases: add non-overlapping before new interval, merge all overlapping, add remaining.",
 brute:{tc:"O(n log n)",sc:"O(n)",code:`int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> list = new ArrayList<>(Arrays.asList(intervals));
    list.add(newInterval);
    list.sort((a,b) -> a[0]-b[0]);
    // then run merge intervals
    List<int[]> res = new ArrayList<>();
    for (int[] curr : list) {
        if (!res.isEmpty() && curr[0] <= res.get(res.size()-1)[1])
            res.get(res.size()-1)[1] = Math.max(res.get(res.size()-1)[1], curr[1]);
        else res.add(curr);
    }
    return res.toArray(new int[0][]);
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int[][] insert(int[][] iv, int[] ni) {
    List<int[]> res = new ArrayList<>();
    int i=0, n=iv.length;
    while (i<n && iv[i][1] < ni[0]) res.add(iv[i++]);
    while (i<n && iv[i][0] <= ni[1]) {
        ni[0] = Math.min(ni[0], iv[i][0]);
        ni[1] = Math.max(ni[1], iv[i][1]);
        i++;
    }
    res.add(ni);
    while (i<n) res.add(iv[i++]);
    return res.toArray(new int[0][]);
}`,note:"Already sorted input — O(n) with no sort. Three-phase: skip before, merge overlapping, copy rest."}},

{id:16,num:"LC#435",name:"Non-overlapping Intervals",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Greedy",algo:"Sort by End Time",tags:["greedy","sorting","intervals"],
 concept:"Sort by end time. Keep interval with earliest end. Remove overlapping ones.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int eraseOverlapIntervals(int[][] intervals) {
    int n = intervals.length, maxChain = 0;
    int[] dp = new int[n]; Arrays.fill(dp,1);
    Arrays.sort(intervals, (a,b) -> a[0]-b[0]);
    for (int i=1; i<n; i++)
        for (int j=0; j<i; j++)
            if (intervals[j][1] <= intervals[i][0])
                dp[i] = Math.max(dp[i], dp[j]+1);
    for (int d : dp) maxChain = Math.max(maxChain, d);
    return n - maxChain;
}`},
 optimal:{tc:"O(n log n)",sc:"O(1)",code:`int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a,b) -> a[1]-b[1]);
    int remove=0, end=Integer.MIN_VALUE;
    for (int[] iv : intervals) {
        if (iv[0] >= end) end = iv[1];
        else remove++;
    }
    return remove;
}`,note:"Sort by END gives optimal greedy. Equivalent to finding max non-overlapping intervals (n - maxChain)."}},

{id:17,num:"LC#986",name:"Interval List Intersections",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Two Pointer on Sorted Intervals",tags:["two-pointer","intervals"],
 concept:"Two pointers on both lists. Intersection if max(starts)<=min(ends). Advance pointer with smaller end.",
 brute:{tc:"O(mn)",sc:"O(1)",code:`int[][] intervalIntersection(int[][] A, int[][] B) {
    List<int[]> res = new ArrayList<>();
    for (int[] a : A)
        for (int[] b : B) {
            int lo = Math.max(a[0],b[0]), hi = Math.min(a[1],b[1]);
            if (lo <= hi) res.add(new int[]{lo,hi});
        }
    return res.toArray(new int[0][]);
}`},
 optimal:{tc:"O(m+n)",sc:"O(1)",code:`int[][] intervalIntersection(int[][] A, int[][] B) {
    List<int[]> res = new ArrayList<>();
    int i=0, j=0;
    while (i<A.length && j<B.length) {
        int lo = Math.max(A[i][0], B[j][0]);
        int hi = Math.min(A[i][1], B[j][1]);
        if (lo <= hi) res.add(new int[]{lo,hi});
        if (A[i][1] < B[j][1]) i++; else j++;
    }
    return res.toArray(new int[0][]);
}`,note:"Advance interval ending earlier — it can't contribute to future intersections."}},

{id:18,num:"LC#152",name:"Maximum Product Subarray",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Kadane's",algo:"Track Min & Max",tags:["dp","kadane"],
 concept:"Negatives flip max↔min. Track both maxP and minP. At each step: new max = max(num, maxP×num, minP×num).",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int maxProduct(int[] nums) {
    int res = Integer.MIN_VALUE;
    for (int i=0; i<nums.length; i++) {
        int p=1;
        for (int j=i; j<nums.length; j++) {
            p *= nums[j]; res = Math.max(res, p);
        }
    }
    return res;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int maxProduct(int[] nums) {
    int maxP=nums[0], minP=nums[0], res=nums[0];
    for (int i=1; i<nums.length; i++) {
        int tempMax = maxP;
        maxP = Math.max(nums[i], Math.max(maxP*nums[i], minP*nums[i]));
        minP = Math.min(nums[i], Math.min(tempMax*nums[i], minP*nums[i]));
        res = Math.max(res, maxP);
    }
    return res;
}`,note:"Save tempMax BEFORE computing minP — otherwise uses stale updated maxP."}},

{id:19,num:"LC#41",name:"First Missing Positive",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","Coding Ninjas"],
 pattern:"Cyclic Sort",algo:"Cyclic Sort",tags:["cyclic-sort"],
 concept:"Place each positive number [1..n] at its correct index. Then find first mismatch — that index+1 is missing.",
 brute:{tc:"O(n)",sc:"O(n)",code:`int firstMissingPositive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    for (int i=1; ; i++) if (!set.contains(i)) return i;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i=0; i<n; ) {
        int j = nums[i]-1;
        if (j>=0 && j<n && nums[j]!=nums[i]) { int t=nums[i]; nums[i]=nums[j]; nums[j]=t; }
        else i++;
    }
    for (int i=0; i<n; i++) if (nums[i] != i+1) return i+1;
    return n+1;
}`,note:"Ignore values ≤0 and >n. Inner while replaced with if+i++ to avoid infinite loop on duplicates."}},

{id:20,num:"LC#287",name:"Find the Duplicate Number",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Two Pointer",algo:"Floyd's Cycle Detection",tags:["floyd","cycle"],
 concept:"Array [1..n] as implicit linked list: i→nums[i]. Duplicate creates cycle. Floyd's finds cycle entry = duplicate.",
 brute:{tc:"O(n)",sc:"O(n)",code:`int findDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int n : nums) if (!seen.add(n)) return n;
    return -1;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int findDuplicate(int[] nums) {
    int slow=nums[0], fast=nums[0];
    do { slow=nums[slow]; fast=nums[nums[fast]]; } while(slow!=fast);
    slow = nums[0];
    while (slow != fast) { slow=nums[slow]; fast=nums[fast]; }
    return slow;
}`,note:"Reset slow to nums[0] NOT 0. Both start at nums[0] (first element of the implicit linked list)."}},

{id:21,num:"LC#239",name:"Sliding Window Maximum",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Sliding Window",algo:"Monotonic Deque",tags:["deque","monotonic"],
 concept:"Monotonic decreasing deque of indices. Front = max. Remove back if smaller than new element. Remove front if outside window.",
 brute:{tc:"O(n·k)",sc:"O(1)",code:`int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] res = new int[n-k+1];
    for (int i=0; i<=n-k; i++) {
        int max = nums[i];
        for (int j=i; j<i+k; j++) max = Math.max(max, nums[j]);
        res[i] = max;
    }
    return res;
}`},
 optimal:{tc:"O(n)",sc:"O(k)",code:`int[] maxSlidingWindow(int[] nums, int k) {
    int n = nums.length;
    int[] res = new int[n-k+1];
    Deque<Integer> dq = new ArrayDeque<>();
    for (int i=0; i<n; i++) {
        if (!dq.isEmpty() && dq.peek() < i-k+1) dq.poll();
        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
        dq.offer(i);
        if (i >= k-1) res[i-k+1] = nums[dq.peek()];
    }
    return res;
}`,note:"Deque stores indices not values. Front is always the maximum of the current window."}},

{id:22,num:"LC#3",name:"Longest Substring Without Repeating Characters",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Sliding Window",algo:"Variable Window + HashMap",tags:["sliding-window","hashmap"],
 concept:"HashMap stores last index of each char. When duplicate found, jump left pointer to max(left, lastSeen+1). Never move left backward.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int lengthOfLongestSubstring(String s) {
    int max = 0;
    for (int i=0; i<s.length(); i++) {
        Set<Character> seen = new HashSet<>();
        for (int j=i; j<s.length(); j++) {
            if (!seen.add(s.charAt(j))) break;
            max = Math.max(max, j-i+1);
        }
    }
    return max;
}`},
 optimal:{tc:"O(n)",sc:"O(min(n,m))",code:`int lengthOfLongestSubstring(String s) {
    Map<Character,Integer> map = new HashMap<>();
    int left=0, max=0;
    for (int r=0; r<s.length(); r++) {
        char c = s.charAt(r);
        if (map.containsKey(c)) left = Math.max(left, map.get(c)+1);
        map.put(c, r);
        max = Math.max(max, r-left+1);
    }
    return max;
}`,note:"max(left,...) prevents left pointer from moving backward when duplicate is outside current window."}},

{id:23,num:"LC#76",name:"Minimum Window Substring",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Sliding Window",algo:"Variable Window + Frequency Map",tags:["sliding-window","hashmap"],
 concept:"Expand right until all t chars satisfied (formed==required). Shrink left to minimize. Track best window.",
 brute:{tc:"O(n²·m)",sc:"O(m)",code:`String minWindow(String s, String t) {
    String res = "";
    for (int i=0; i<s.length(); i++) {
        for (int j=i+1; j<=s.length(); j++) {
            String sub = s.substring(i,j);
            if (containsAll(sub,t) && (res.isEmpty() || j-i < res.length())) res=sub;
        }
    }
    return res;
}`},
 optimal:{tc:"O(n+m)",sc:"O(m)",code:`String minWindow(String s, String t) {
    Map<Character,Integer> need=new HashMap<>(), have=new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c,1,Integer::sum);
    int formed=0, req=need.size(), lo=0;
    int minLen=Integer.MAX_VALUE, start=0;
    for (int hi=0; hi<s.length(); hi++) {
        char c = s.charAt(hi);
        have.merge(c,1,Integer::sum);
        if (need.containsKey(c) && have.get(c).equals(need.get(c))) formed++;
        while (formed==req) {
            if (hi-lo+1 < minLen) { minLen=hi-lo+1; start=lo; }
            char lc=s.charAt(lo++);
            have.merge(lc,-1,Integer::sum);
            if (need.containsKey(lc) && have.get(lc)<need.get(lc)) formed--;
        }
    }
    return minLen==Integer.MAX_VALUE ? "" : s.substring(start,start+minLen);
}`,note:"formed counts chars meeting their required frequency. Shrink greedily to minimize window."}},

{id:24,num:"LC#209",name:"Minimum Size Subarray Sum",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Sliding Window",algo:"Variable Sliding Window",tags:["sliding-window"],
 concept:"Variable window: expand right (add), shrink left while sum>=target. Works only with positives.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int minSubArrayLen(int target, int[] nums) {
    int min = Integer.MAX_VALUE;
    for (int i=0; i<nums.length; i++) {
        int sum=0;
        for (int j=i; j<nums.length; j++) {
            sum+=nums[j];
            if (sum>=target) { min=Math.min(min,j-i+1); break; }
        }
    }
    return min==Integer.MAX_VALUE ? 0 : min;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int minSubArrayLen(int target, int[] nums) {
    int lo=0, sum=0, min=Integer.MAX_VALUE;
    for (int hi=0; hi<nums.length; hi++) {
        sum += nums[hi];
        while (sum >= target) {
            min = Math.min(min, hi-lo+1);
            sum -= nums[lo++];
        }
    }
    return min==Integer.MAX_VALUE ? 0 : min;
}`,note:"Each element added and removed at most once → O(n) total. while not if — squeeze to minimum."}},

{id:25,num:"LC#4",name:"Median of Two Sorted Arrays",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Binary Search",algo:"Binary Search on Partition",tags:["binary-search","divide-conquer"],
 concept:"Binary search on shorter array. Partition both so left half total = (m+n+1)/2. Check maxLeft <= minRight.",
 brute:{tc:"O(m+n)",sc:"O(m+n)",code:`double findMedianSortedArrays(int[] A, int[] B) {
    int[] merged = new int[A.length+B.length];
    int i=0,j=0,k=0;
    while(i<A.length && j<B.length) merged[k++]= A[i]<=B[j]?A[i++]:B[j++];
    while(i<A.length) merged[k++]=A[i++];
    while(j<B.length) merged[k++]=B[j++];
    int n=merged.length;
    return n%2==1 ? merged[n/2] : (merged[n/2-1]+merged[n/2])/2.0;
}`},
 optimal:{tc:"O(log min(m,n))",sc:"O(1)",code:`double findMedianSortedArrays(int[] A, int[] B) {
    if (A.length > B.length) return findMedianSortedArrays(B, A);
    int m=A.length, n=B.length, lo=0, hi=m;
    while (lo <= hi) {
        int pA=lo+(hi-lo)/2, pB=(m+n+1)/2-pA;
        int lA=pA>0?A[pA-1]:Integer.MIN_VALUE;
        int rA=pA<m?A[pA]:Integer.MAX_VALUE;
        int lB=pB>0?B[pB-1]:Integer.MIN_VALUE;
        int rB=pB<n?B[pB]:Integer.MAX_VALUE;
        if (lA<=rB && lB<=rA) {
            if ((m+n)%2==1) return Math.max(lA,lB);
            return (Math.max(lA,lB)+Math.min(rA,rB))/2.0;
        } else if (lA>rB) hi=pA-1;
        else lo=pA+1;
    }
    return 0;
}`,note:"Binary search on how many elements to take from shorter array. Partition must satisfy maxLeft<=minRight."}},

{id:26,num:"LC#34",name:"First and Last Position in Sorted Array",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","Coding Ninjas"],
 pattern:"Binary Search",algo:"Lower Bound + Upper Bound",tags:["binary-search"],
 concept:"Two binary searches: lower bound (first target) and upper bound (first element > target, subtract 1).",
 brute:{tc:"O(n)",sc:"O(1)",code:`int[] searchRange(int[] nums, int target) {
    int first=-1, last=-1;
    for (int i=0; i<nums.length; i++) {
        if (nums[i]==target) { if(first==-1) first=i; last=i; }
    }
    return new int[]{first,last};
}`},
 optimal:{tc:"O(log n)",sc:"O(1)",code:`int[] searchRange(int[] nums, int t) {
    return new int[]{findFirst(nums,t), findLast(nums,t)};
}
int findFirst(int[] a, int t) {
    int lo=0,hi=a.length-1,res=-1;
    while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]==t){res=m;hi=m-1;}else if(a[m]<t)lo=m+1;else hi=m-1;}
    return res;
}
int findLast(int[] a, int t) {
    int lo=0,hi=a.length-1,res=-1;
    while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]==t){res=m;lo=m+1;}else if(a[m]<t)lo=m+1;else hi=m-1;}
    return res;
}`,note:"findFirst: on match go LEFT (hi=m-1). findLast: on match go RIGHT (lo=m+1)."}},

{id:27,num:"LC#162",name:"Find Peak Element",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Binary Search",algo:"Binary Search",tags:["binary-search"],
 concept:"If nums[mid] < nums[mid+1], peak is somewhere on right (ascending slope). Otherwise peak is here or left.",
 brute:{tc:"O(n)",sc:"O(1)",code:`int findPeakElement(int[] nums) {
    for (int i=0; i<nums.length-1; i++) if (nums[i]>nums[i+1]) return i;
    return nums.length-1;
}`},
 optimal:{tc:"O(log n)",sc:"O(1)",code:`int findPeakElement(int[] nums) {
    int lo=0, hi=nums.length-1;
    while (lo < hi) {
        int mid = lo+(hi-lo)/2;
        if (nums[mid] < nums[mid+1]) lo=mid+1;
        else hi=mid;
    }
    return lo;
}`,note:"Boundaries treated as -∞ so first/last element can be peaks. Any local peak is valid."}},

{id:28,num:"LC#169",name:"Majority Element (> n/2)",cat:"1D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Boyer-Moore",algo:"Boyer-Moore Voting",tags:["voting"],
 concept:"Boyer-Moore: candidate cancels with non-matches. Majority element always survives cancellation.",
 brute:{tc:"O(n)",sc:"O(n)",code:`int majorityElement(int[] nums) {
    Map<Integer,Integer> m = new HashMap<>();
    for (int n : nums) {
        m.merge(n,1,Integer::sum);
        if (m.get(n) > nums.length/2) return n;
    }
    return -1;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int majorityElement(int[] nums) {
    int candidate=nums[0], count=1;
    for (int i=1; i<nums.length; i++) {
        if (count==0) candidate=nums[i];
        count += (nums[i]==candidate) ? 1 : -1;
    }
    return candidate;
}`,note:"Each cancellation removes 1 majority + 1 non-majority. Majority has net surplus."}},

{id:29,num:"LC#229",name:"Majority Element II (> n/3)",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Boyer-Moore",algo:"Extended Boyer-Moore (2 candidates)",tags:["voting"],
 concept:"At most 2 elements can appear > n/3 times. Track 2 candidates. MUST verify with second pass.",
 brute:{tc:"O(n)",sc:"O(n)",code:`List<Integer> majorityElement(int[] nums) {
    Map<Integer,Integer> map = new HashMap<>();
    for (int n : nums) map.merge(n,1,Integer::sum);
    List<Integer> res = new ArrayList<>();
    for (var e : map.entrySet()) if (e.getValue()>nums.length/3) res.add(e.getKey());
    return res;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`List<Integer> majorityElement(int[] nums) {
    int c1=0,c2=0,n1=Integer.MIN_VALUE,n2=Integer.MAX_VALUE;
    for (int n : nums) {
        if(n==n1)c1++; else if(n==n2)c2++;
        else if(c1==0){n1=n;c1=1;} else if(c2==0){n2=n;c2=1;}
        else{c1--;c2--;}
    }
    c1=0; c2=0;
    for (int n : nums) { if(n==n1)c1++; else if(n==n2)c2++; }
    List<Integer> res=new ArrayList<>();
    if(c1>nums.length/3) res.add(n1);
    if(c2>nums.length/3) res.add(n2);
    return res;
}`,note:"MUST verify candidates with second pass. Without verification, wrong answers possible."}},

{id:30,num:"LC#875",name:"Koko Eating Bananas",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Coding Ninjas"],
 pattern:"Binary Search",algo:"Binary Search on Answer",tags:["binary-search","greedy"],
 concept:"BS on eating speed. lo=1, hi=max(piles). Check if speed mid finishes in h hours.",
 brute:{tc:"O(max×n)",sc:"O(1)",code:`int minEatingSpeed(int[] piles, int h) {
    for (int k=1; ; k++) {
        long hours=0;
        for (int p : piles) hours += (p+k-1)/k;
        if (hours <= h) return k;
    }
}`},
 optimal:{tc:"O(n log max)",sc:"O(1)",code:`int minEatingSpeed(int[] piles, int h) {
    int lo=1, hi=Arrays.stream(piles).max().getAsInt();
    while (lo < hi) {
        int mid = lo+(hi-lo)/2;
        long hours=0;
        for (int p : piles) hours += (p+mid-1)/mid;
        if (hours<=h) hi=mid; else lo=mid+1;
    }
    return lo;
}`,note:"(p+mid-1)/mid = Math.ceil(p/mid) without floating point. Avoids Math.ceil."}},

{id:31,num:"CN",name:"Allocate Minimum Pages (BS on Answer)",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","Striver","Love Babbar","Coding Ninjas","GFG"],
 pattern:"Binary Search",algo:"Binary Search on Answer",tags:["binary-search","greedy"],
 concept:"BS on max pages per student. lo=max(arr), hi=sum(arr). isValid: greedy check students needed.",
 brute:{tc:"O(n³)",sc:"O(1)",code:`int allocatePages(int[] pages, int k) {
    int lo=0, hi=0;
    for (int p : pages) { lo=Math.max(lo,p); hi+=p; }
    for (int mid=lo; mid<=hi; mid++)
        if (isValid(pages,k,mid)) return mid;
    return -1;
}`},
 optimal:{tc:"O(n log S)",sc:"O(1)",code:`int allocatePages(int[] pages, int k) {
    int lo=0, hi=0;
    for (int p : pages) { lo=Math.max(lo,p); hi+=p; }
    int ans=hi;
    while (lo<=hi) {
        int mid=lo+(hi-lo)/2;
        if (isValid(pages,k,mid)) { ans=mid; hi=mid-1; } else lo=mid+1;
    }
    return ans;
}
boolean isValid(int[] pages, int k, int maxP) {
    int students=1, sum=0;
    for (int p : pages) { if(sum+p>maxP){students++;sum=0;} sum+=p; }
    return students<=k;
}`,note:"SAME TEMPLATE as Ship Packages, Split Array. lo=single largest, hi=total."}},

{id:32,num:"LC#493",name:"Reverse Pairs",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver","Coding Ninjas"],
 pattern:"Divide & Conquer",algo:"Modified Merge Sort",tags:["merge-sort","inversions"],
 concept:"Count pairs where nums[i] > 2*nums[j] (i<j). Count step SEPARATE from merge step, both using sorted order.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int reversePairs(int[] nums) {
    int cnt=0;
    for(int i=0;i<nums.length;i++)
        for(int j=i+1;j<nums.length;j++)
            if((long)nums[i]>2L*nums[j]) cnt++;
    return cnt;
}`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`int cnt=0;
int reversePairs(int[] nums) { cnt=0; ms(nums,0,nums.length-1); return cnt; }
void ms(int[] a, int lo, int hi) {
    if(lo>=hi) return; int m=lo+(hi-lo)/2;
    ms(a,lo,m); ms(a,m+1,hi);
    int j=m+1;
    for(int i=lo;i<=m;i++){while(j<=hi&&(long)a[i]>2L*a[j])j++;cnt+=j-m-1;}
    merge(a,lo,m,hi);
}
void merge(int[] a,int lo,int mid,int hi){
    int[] tmp=Arrays.copyOfRange(a,lo,hi+1);
    int i=lo,j=mid+1,k=lo;
    while(i<=mid&&j<=hi) a[k++]= tmp[i-lo]<=tmp[j-lo]?tmp[i++-lo]:tmp[j++-lo];
    while(i<=mid)a[k++]=tmp[i++-lo]; while(j<=hi)a[k++]=tmp[j++-lo];
}`,note:"Count BEFORE merge using two-pointers on sorted halves. 2L prevents int overflow."}},

{id:33,num:"GFG",name:"Count Inversions",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","Striver","Love Babbar","GFG","Coding Ninjas"],
 pattern:"Divide & Conquer",algo:"Modified Merge Sort",tags:["merge-sort"],
 concept:"During merge: when right element placed before left elements, inversions += remaining left count.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`long countInversions(int[] a) {
    long cnt=0;
    for(int i=0;i<a.length;i++)
        for(int j=i+1;j<a.length;j++)
            if(a[i]>a[j]) cnt++;
    return cnt;
}`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`long cnt=0;
long countInversions(int[] arr) { cnt=0; mergeSort(arr,0,arr.length-1); return cnt; }
void mergeSort(int[] a, int lo, int hi) {
    if(lo>=hi) return;
    int mid=lo+(hi-lo)/2;
    mergeSort(a,lo,mid); mergeSort(a,mid+1,hi);
    merge(a,lo,mid,hi);
}
void merge(int[] a, int lo, int mid, int hi) {
    int[] L=Arrays.copyOfRange(a,lo,mid+1), R=Arrays.copyOfRange(a,mid+1,hi+1);
    int i=0,j=0,k=lo;
    while(i<L.length && j<R.length) {
        if(L[i]<=R[j]) a[k++]=L[i++];
        else{ a[k++]=R[j++]; cnt+=(L.length-i); }
    }
    while(i<L.length)a[k++]=L[i++]; while(j<R.length)a[k++]=R[j++];
}`,note:"When R[j] < L[i], all remaining elements in L are also > R[j] (L is sorted). Count += remaining L."}},

{id:34,num:"LC#45",name:"Jump Game II",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Greedy",algo:"Greedy BFS",tags:["greedy","bfs"],
 concept:"Level-order BFS: at each jump level track farthest reachable. Jump count = number of levels.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int jump(int[] nums) {
    int n=nums.length;
    int[] dp=new int[n]; Arrays.fill(dp,Integer.MAX_VALUE); dp[0]=0;
    for(int i=0;i<n;i++) if(dp[i]!=Integer.MAX_VALUE)
        for(int j=1;j<=nums[i]&&i+j<n;j++) dp[i+j]=Math.min(dp[i+j],dp[i]+1);
    return dp[n-1];
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int jump(int[] nums) {
    int jumps=0, curEnd=0, farthest=0;
    for (int i=0; i<nums.length-1; i++) {
        farthest = Math.max(farthest, i+nums[i]);
        if (i==curEnd) { jumps++; curEnd=farthest; }
    }
    return jumps;
}`,note:"curEnd = end of current BFS level. When i reaches curEnd, increment jump and advance level."}},

{id:35,num:"LC#134",name:"Gas Station",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Greedy",algo:"Greedy",tags:["greedy","circular"],
 concept:"If total gas >= total cost, solution exists. Whenever tank dips below 0, reset start to i+1.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int canCompleteCircuit(int[] gas, int[] cost) {
    for(int i=0;i<gas.length;i++){
        int tank=0; boolean ok=true;
        for(int j=0;j<gas.length;j++){
            int idx=(i+j)%gas.length;
            tank+=gas[idx]-cost[idx];
            if(tank<0){ok=false;break;}
        }
        if(ok) return i;
    }
    return -1;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int canCompleteCircuit(int[] gas, int[] cost) {
    int total=0, tank=0, start=0;
    for (int i=0; i<gas.length; i++) {
        total += gas[i]-cost[i];
        tank  += gas[i]-cost[i];
        if (tank < 0) { start=i+1; tank=0; }
    }
    return total >= 0 ? start : -1;
}`,note:"If total >= 0, exactly one valid start exists. The greedy reset finds it."}},

{id:36,num:"LC#135",name:"Candy Distribution",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Greedy",algo:"Two-Pass Greedy",tags:["greedy"],
 concept:"Left pass: rating[i]>rating[i-1] → candy[i]=candy[i-1]+1. Right pass: rating[i]>rating[i+1] → candy[i]=max(candy[i],candy[i+1]+1).",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int candy(int[] ratings) {
    int n=ratings.length;
    int[] candy=new int[n]; Arrays.fill(candy,1);
    boolean changed=true;
    while(changed){ changed=false;
        for(int i=1;i<n;i++) if(ratings[i]>ratings[i-1]&&candy[i]<=candy[i-1]){candy[i]=candy[i-1]+1;changed=true;}
        for(int i=n-2;i>=0;i--) if(ratings[i]>ratings[i+1]&&candy[i]<=candy[i+1]){candy[i]=candy[i+1]+1;changed=true;}
    }
    int sum=0; for(int c:candy) sum+=c; return sum;
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int candy(int[] ratings) {
    int n=ratings.length;
    int[] candy=new int[n]; Arrays.fill(candy,1);
    for(int i=1;i<n;i++) if(ratings[i]>ratings[i-1]) candy[i]=candy[i-1]+1;
    for(int i=n-2;i>=0;i--) if(ratings[i]>ratings[i+1]) candy[i]=Math.max(candy[i],candy[i+1]+1);
    int sum=0; for(int c:candy) sum+=c; return sum;
}`,note:"Two independent constraints resolved in two passes. Final satisfies both."}},

{id:37,num:"LC#122",name:"Best Time to Buy Sell Stock II",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Greedy",algo:"Greedy",tags:["greedy","dp"],
 concept:"Every upward step is profit. Sum all positive differences. Valley-to-peak = sum of daily gains.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`// Recursive: try all buy/sell combinations — exponential`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int maxProfit(int[] prices) {
    int profit = 0;
    for (int i=1; i<prices.length; i++)
        if (prices[i] > prices[i-1]) profit += prices[i]-prices[i-1];
    return profit;
}`,note:"Mathematical equivalence: valley-to-peak gain = sum of all daily positive increments."}},

{id:38,num:"LC#123",name:"Best Time to Buy Sell Stock III",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"State Machine DP",tags:["dp","state-machine"],
 concept:"4 states: buy1, sell1, buy2, sell2. sell1 feeds into buy2 (use first profit to reinvest).",
 brute:{tc:"O(n³)",sc:"O(1)",code:`// Try all pairs of non-overlapping buy-sell intervals — O(n³)`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int maxProfit(int[] prices) {
    int buy1=Integer.MIN_VALUE, sell1=0;
    int buy2=Integer.MIN_VALUE, sell2=0;
    for (int p : prices) {
        buy1  = Math.max(buy1, -p);
        sell1 = Math.max(sell1, buy1+p);
        buy2  = Math.max(buy2, sell1-p);
        sell2 = Math.max(sell2, buy2+p);
    }
    return sell2;
}`,note:"sell1 funds buy2. This chaining naturally handles non-overlapping constraint."}},

{id:39,num:"LC#188",name:"Best Time to Buy Sell Stock IV",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"State Machine DP (K transactions)",tags:["dp","state-machine"],
 concept:"Generalize Stock III to k transactions. buy[j] = max profit after j-th buy. sell[j] = max profit after j-th sell.",
 brute:{tc:"O(n³·k)",sc:"O(k)",code:`// Try all k pairs of non-overlapping buy-sell intervals`},
 optimal:{tc:"O(n·k)",sc:"O(k)",code:`int maxProfit(int k, int[] prices) {
    if (k >= prices.length/2) {
        int profit=0;
        for(int i=1;i<prices.length;i++) if(prices[i]>prices[i-1]) profit+=prices[i]-prices[i-1];
        return profit;
    }
    int[] buy=new int[k], sell=new int[k];
    Arrays.fill(buy, Integer.MIN_VALUE);
    for (int p : prices) {
        for (int j=k-1; j>=0; j--) {
            sell[j] = Math.max(sell[j], buy[j]+p);
            buy[j]  = Math.max(buy[j], (j>0?sell[j-1]:0)-p);
        }
    }
    return sell[k-1];
}`,note:"When k >= n/2, treat as unlimited transactions. Process right-to-left to avoid using same transaction twice."}},

{id:40,num:"GFG",name:"Missing and Repeating",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","Striver","Love Babbar","GFG","Coding Ninjas"],
 pattern:"Bit Manipulation",algo:"Math / Cyclic Sort",tags:["math","xor"],
 concept:"Two equations: (miss-rep)=sum_diff, (miss²-rep²)=(miss+rep)(miss-rep). Solve for miss and rep.",
 brute:{tc:"O(n)",sc:"O(n)",code:`int[] findMissingRepeating(int[] arr) {
    int[] freq=new int[arr.length+1];
    for(int x:arr) freq[x]++;
    int miss=-1,rep=-1;
    for(int i=1;i<=arr.length;i++) {if(freq[i]==0)miss=i; if(freq[i]==2)rep=i;}
    return new int[]{miss,rep};
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int[] findMissingRepeating(int[] arr) {
    long n=arr.length, s=0, sq=0;
    for(int x:arr){s+=x; sq+=(long)x*x;}
    long sumN=n*(n+1)/2, sqN=n*(n+1)*(2*n+1)/6;
    long diff=sumN-s;
    long sqDiff=sqN-sq;
    long sumXY=sqDiff/diff;
    long miss=(diff+sumXY)/2, rep=(sumXY-diff)/2;
    return new int[]{(int)miss,(int)rep};
}`,note:"diff = miss-rep. sqDiff/(miss-rep) = miss+rep. Solve system of 2 equations in 2 unknowns."}},

{id:41,num:"LC#300",name:"Longest Increasing Subsequence (LIS)",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","Coding Ninjas"],
 pattern:"DP",algo:"Patience Sorting (Binary Search)",tags:["dp","binary-search"],
 concept:"Patience sorting: maintain tails[] of minimum tail values. Binary search for position of each element.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int lengthOfLIS(int[] nums) {
    int n=nums.length; int[] dp=new int[n]; Arrays.fill(dp,1);
    int max=1;
    for(int i=1;i<n;i++){
        for(int j=0;j<i;j++) if(nums[j]<nums[i]) dp[i]=Math.max(dp[i],dp[j]+1);
        max=Math.max(max,dp[i]);
    }
    return max;
}`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int n : nums) {
        int lo=0, hi=tails.size();
        while(lo<hi){int m=lo+(hi-lo)/2; if(tails.get(m)<n)lo=m+1; else hi=m;}
        if(lo==tails.size()) tails.add(n);
        else tails.set(lo, n);
    }
    return tails.size();
}`,note:"tails[] does NOT represent actual LIS. It maintains minimum possible tail for each LIS length."}},

{id:42,num:"LC#739",name:"Daily Temperatures",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Monotonic Stack",algo:"Monotonic Decreasing Stack",tags:["stack","monotonic"],
 concept:"Decreasing stack of indices. When current temp > stack.top temp, pop and record wait time = i - index.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int[] dailyTemperatures(int[] T) {
    int[] res=new int[T.length];
    for(int i=0;i<T.length;i++)
        for(int j=i+1;j<T.length;j++)
            if(T[j]>T[i]){res[i]=j-i;break;}
    return res;
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int[] dailyTemperatures(int[] T) {
    int[] res=new int[T.length];
    Deque<Integer> stack=new ArrayDeque<>();
    for(int i=0;i<T.length;i++){
        while(!stack.isEmpty() && T[i]>T[stack.peek()]){
            int idx=stack.pop();
            res[idx]=i-idx;
        }
        stack.push(i);
    }
    return res;
}`,note:"res[idx] = i - idx (current index minus the popped index). Stack stores indices not temperatures."}},

{id:43,num:"LC#215",name:"Kth Largest Element",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Sorting",algo:"QuickSelect / Min-Heap",tags:["quickselect","heap"],
 concept:"Three approaches: Sort O(n log n), Min-heap size k O(n log k), QuickSelect O(n) avg. Min-heap is safest for interviews.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`int findKthLargest(int[] nums, int k) {
    Arrays.sort(nums); return nums[nums.length-k];
}`},
 optimal:{tc:"O(n log k)",sc:"O(k)",code:`int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int n : nums) {
        pq.offer(n);
        if (pq.size() > k) pq.poll();
    }
    return pq.peek();
}`,note:"Min-heap guarantees O(n log k) worst case. QuickSelect O(n) average but O(n²) worst case."}},

{id:44,num:"LC#907",name:"Sum of Subarray Minimums",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Monotonic Stack",algo:"Monotonic Stack + Contribution",tags:["stack","monotonic","contribution"],
 concept:"For each element, find left boundary (prev smaller) and right boundary (next smaller or equal). Contribution = arr[i] × left_span × right_span.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int sumSubarrayMins(int[] arr) {
    long sum=0; int MOD=1_000_000_007;
    for(int i=0;i<arr.length;i++){
        int min=arr[i];
        for(int j=i;j<arr.length;j++){min=Math.min(min,arr[j]);sum=(sum+min)%MOD;}
    }
    return (int)sum;
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int sumSubarrayMins(int[] arr) {
    int MOD=1_000_000_007; int n=arr.length;
    int[] left=new int[n], right=new int[n];
    Deque<Integer> st=new ArrayDeque<>();
    for(int i=0;i<n;i++){while(!st.isEmpty()&&arr[st.peek()]>=arr[i])st.pop();left[i]=st.isEmpty()?i+1:i-st.peek();st.push(i);}
    st.clear();
    for(int i=n-1;i>=0;i--){while(!st.isEmpty()&&arr[st.peek()]>arr[i])st.pop();right[i]=st.isEmpty()?n-i:st.peek()-i;st.push(i);}
    long sum=0;
    for(int i=0;i<n;i++) sum=(sum+(long)arr[i]*left[i]*right[i])%MOD;
    return (int)sum;
}`,note:"Use strict > for left and >= for right to avoid double-counting equal elements."}},

{id:45,num:"LC#1004",name:"Max Consecutive Ones III",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Sliding Window",algo:"Sliding Window (At Most K Zeros)",tags:["sliding-window","at-most-k"],
 concept:"Maintain window with at most k zeros. Expand right; when zeros > k, shrink from left.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int longestOnes(int[] nums, int k) {
    int max=0;
    for(int i=0;i<nums.length;i++){
        int zeros=0;
        for(int j=i;j<nums.length;j++){
            if(nums[j]==0)zeros++;
            if(zeros<=k)max=Math.max(max,j-i+1); else break;
        }
    }
    return max;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int longestOnes(int[] nums, int k) {
    int lo=0, zeros=0, max=0;
    for(int hi=0;hi<nums.length;hi++){
        if(nums[hi]==0) zeros++;
        while(zeros>k){ if(nums[lo++]==0) zeros--; }
        max=Math.max(max,hi-lo+1);
    }
    return max;
}`,note:"Window always contains at most k zeros. Shrink from left when invariant violated."}},

{id:46,num:"LC#410",name:"Split Array Largest Sum",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Binary Search",algo:"Binary Search on Answer",tags:["binary-search","greedy-check"],
 concept:"BS on maximum subarray sum. lo=max(arr), hi=sum(arr). isValid: greedy check number of subarrays needed.",
 brute:{tc:"O(n^m)",sc:"O(n)",code:`// Try all ways to split into m subarrays — exponential`},
 optimal:{tc:"O(n log S)",sc:"O(1)",code:`int splitArray(int[] nums, int m) {
    int lo=0, hi=0;
    for(int n:nums){lo=Math.max(lo,n);hi+=n;}
    int ans=hi;
    while(lo<=hi){
        int mid=lo+(hi-lo)/2;
        int parts=1,curr=0;
        for(int n:nums){if(curr+n>mid){parts++;curr=0;}curr+=n;}
        if(parts<=m){ans=mid;hi=mid-1;}else lo=mid+1;
    }
    return ans;
}`,note:"Exact same template as Allocate Pages, Koko Eating Bananas. Master the isValid greedy check."}},

/* ══════════════ SECTION 2 — KNAPSACK / DP ══════════════ */

{id:47,num:"LC#198",name:"House Robber",cat:"DP",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"DP",algo:"Linear DP",tags:["dp"],
 concept:"dp[i] = max(dp[i-1], dp[i-2]+nums[i]). Roll to O(1) space using two variables.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`int rob(int[] nums) {
    return helper(nums, nums.length-1);
}
int helper(int[] nums, int i) {
    if(i<0) return 0;
    return Math.max(helper(nums,i-1), helper(nums,i-2)+nums[i]);
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int rob(int[] nums) {
    int prev2=0, prev1=0;
    for (int n : nums) {
        int curr = Math.max(prev1, prev2+n);
        prev2=prev1; prev1=curr;
    }
    return prev1;
}`,note:"prev2 = dp[i-2], prev1 = dp[i-1]. Roll forward, no array needed."}},

{id:48,num:"LC#213",name:"House Robber II (Circular)",cat:"DP",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"Linear DP (2 runs)",tags:["dp","circular"],
 concept:"Cannot rob both first and last house. Run House Robber I on [0..n-2] and [1..n-1], take max.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`// Recursive with memoization both ranges`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int rob(int[] nums) {
    int n=nums.length;
    if(n==1) return nums[0];
    return Math.max(robRange(nums,0,n-2), robRange(nums,1,n-1));
}
int robRange(int[] nums, int lo, int hi) {
    int prev2=0, prev1=0;
    for(int i=lo;i<=hi;i++){int curr=Math.max(prev1,prev2+nums[i]);prev2=prev1;prev1=curr;}
    return prev1;
}`,note:"Circular constraint: split into two linear subproblems and take max."}},

{id:49,num:"LC#416",name:"Partition Equal Subset Sum",cat:"Knapsack",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"DP",algo:"0/1 Knapsack",tags:["dp","knapsack"],
 concept:"Find subset with sum = totalSum/2. dp[j] = can we achieve sum j. Iterate backwards to prevent reuse.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`boolean canPartition(int[] nums) {
    int sum=0; for(int n:nums) sum+=n;
    if(sum%2!=0) return false;
    return helper(nums,0,sum/2);
}
boolean helper(int[] nums,int i,int rem){
    if(rem==0) return true; if(i>=nums.length||rem<0) return false;
    return helper(nums,i+1,rem-nums[i])||helper(nums,i+1,rem);
}`},
 optimal:{tc:"O(n×sum)",sc:"O(sum)",code:`boolean canPartition(int[] nums) {
    int sum=0; for(int n:nums) sum+=n;
    if(sum%2!=0) return false;
    int target=sum/2;
    boolean[] dp=new boolean[target+1]; dp[0]=true;
    for(int n:nums)
        for(int j=target;j>=n;j--)
            dp[j]|=dp[j-n];
    return dp[target];
}`,note:"Iterate j BACKWARDS (target→n). Forward iteration would allow using same element multiple times."}},

{id:50,num:"LC#322",name:"Coin Change (Min Coins)",cat:"Knapsack",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"Unbounded Knapsack",tags:["dp","unbounded"],
 concept:"dp[j] = min coins to make amount j. For each coin: dp[j] = min(dp[j], dp[j-coin]+1). Iterate FORWARD (reuse allowed).",
 brute:{tc:"O(S^n)",sc:"O(S)",code:`int coinChange(int[] coins, int amount) {
    return helper(coins, amount);
}
int helper(int[] coins, int rem){
    if(rem==0) return 0; if(rem<0) return -1;
    int min=Integer.MAX_VALUE;
    for(int c:coins){int res=helper(coins,rem-c);if(res>=0) min=Math.min(min,res+1);}
    return min==Integer.MAX_VALUE?-1:min;
}`},
 optimal:{tc:"O(S×n)",sc:"O(S)",code:`int coinChange(int[] coins, int amount) {
    int[] dp=new int[amount+1]; Arrays.fill(dp,amount+1);
    dp[0]=0;
    for(int j=1;j<=amount;j++)
        for(int c:coins)
            if(c<=j) dp[j]=Math.min(dp[j],dp[j-c]+1);
    return dp[amount]>amount ? -1 : dp[amount];
}`,note:"dp[0]=0 (base case). Fill remaining with amount+1 (infinity). Forward iteration = unbounded knapsack."}},

{id:51,num:"LC#518",name:"Coin Change II (Count Ways)",cat:"Knapsack",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"Unbounded Knapsack",tags:["dp","unbounded","combinations"],
 concept:"Count combinations (not permutations). Outer loop: coins. Inner loop: amounts (forward). Each coin processed as group.",
 brute:{tc:"O(S^n)",sc:"O(S)",code:`int change(int amount, int[] coins) {
    return helper(coins,0,amount);
}
int helper(int[] coins,int i,int rem){
    if(rem==0) return 1; if(rem<0||i>=coins.length) return 0;
    return helper(coins,i,rem-coins[i])+helper(coins,i+1,rem);
}`},
 optimal:{tc:"O(n×S)",sc:"O(S)",code:`int change(int amount, int[] coins) {
    int[] dp=new int[amount+1]; dp[0]=1;
    for(int c:coins)
        for(int j=c;j<=amount;j++)
            dp[j]+=dp[j-c];
    return dp[amount];
}`,note:"Outer=coins, inner=amounts → combinations. Swap order → permutations (each ordering counted separately)."}},

{id:52,num:"LC#494",name:"Target Sum",cat:"Knapsack",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"0/1 Knapsack",tags:["dp","knapsack","subset-sum"],
 concept:"Assign + or - to each num. Reduces to: count subsets with sum = (totalSum + target) / 2. Standard 0/1 knapsack count.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`int findTargetSumWays(int[] nums, int target) {
    return helper(nums,0,target);
}
int helper(int[] nums,int i,int rem){
    if(i==nums.length) return rem==0?1:0;
    return helper(nums,i+1,rem-nums[i])+helper(nums,i+1,rem+nums[i]);
}`},
 optimal:{tc:"O(n×sum)",sc:"O(sum)",code:`int findTargetSumWays(int[] nums, int target) {
    int sum=0; for(int n:nums) sum+=n;
    if((sum+target)%2!=0 || Math.abs(target)>sum) return 0;
    int s=(sum+target)/2;
    int[] dp=new int[s+1]; dp[0]=1;
    for(int n:nums)
        for(int j=s;j>=n;j--)
            dp[j]+=dp[j-n];
    return dp[s];
}`,note:"Key math: let P=positive set, N=negative set. P-N=target, P+N=sum → P=(sum+target)/2."}},

{id:53,num:"GFG",name:"0/1 Knapsack (Classic)",cat:"Knapsack",difficulty:"Medium",
 sheets:["Amazon","Striver","Love Babbar","GFG","Coding Ninjas"],
 pattern:"DP",algo:"0/1 Knapsack",tags:["dp","knapsack","classic"],
 concept:"Each item can be taken at most once. dp[i][w] = max value using first i items with capacity w.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`int knapsack(int[] wt, int[] val, int W, int n) {
    if(n==0||W==0) return 0;
    if(wt[n-1]>W) return knapsack(wt,val,W,n-1);
    return Math.max(val[n-1]+knapsack(wt,val,W-wt[n-1],n-1), knapsack(wt,val,W,n-1));
}`},
 optimal:{tc:"O(n×W)",sc:"O(W)",code:`int knapsack(int[] wt, int[] val, int W) {
    int[] dp=new int[W+1];
    for(int i=0;i<wt.length;i++)
        for(int w=W;w>=wt[i];w--)
            dp[w]=Math.max(dp[w], val[i]+dp[w-wt[i]]);
    return dp[W];
}`,note:"1D DP with BACKWARD iteration = 0/1 knapsack (each item used once). Forward = unbounded knapsack."}},

{id:54,num:"LC#1049",name:"Last Stone Weight II",cat:"Knapsack",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"0/1 Knapsack",tags:["dp","knapsack","partition"],
 concept:"Divide stones into 2 groups. Minimize |sum1 - sum2| = totalSum - 2*maxSubsetSum. Find max subset sum ≤ totalSum/2.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`// Try all 2^n subsets, track closest sum to totalSum/2`},
 optimal:{tc:"O(n×sum)",sc:"O(sum)",code:`int lastStoneWeightII(int[] stones) {
    int sum=0; for(int s:stones) sum+=s;
    int target=sum/2;
    boolean[] dp=new boolean[target+1]; dp[0]=true;
    for(int s:stones)
        for(int j=target;j>=s;j--)
            dp[j]|=dp[j-s];
    for(int j=target;j>=0;j--)
        if(dp[j]) return sum-2*j;
    return sum;
}`,note:"Same as Partition Equal Subset Sum. Return sum-2*maxAchievableHalfSum."}},

{id:55,num:"LC#474",name:"Ones and Zeroes",cat:"Knapsack",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"DP",algo:"2D 0/1 Knapsack",tags:["dp","knapsack","2d-weight"],
 concept:"2D knapsack with constraints on both 0s and 1s. dp[i][j] = max strings using at most i zeros and j ones.",
 brute:{tc:"O(2^n)",sc:"O(1)",code:`// Try all 2^n subsets, check if within (m,n) constraints`},
 optimal:{tc:"O(l×m×n)",sc:"O(m×n)",code:`int findMaxForm(String[] strs, int m, int n) {
    int[][] dp=new int[m+1][n+1];
    for(String s:strs){
        int zeros=0,ones=0;
        for(char c:s.toCharArray()) if(c=='0')zeros++; else ones++;
        for(int i=m;i>=zeros;i--)
            for(int j=n;j>=ones;j--)
                dp[i][j]=Math.max(dp[i][j], dp[i-zeros][j-ones]+1);
    }
    return dp[m][n];
}`,note:"2D knapsack: backward iteration over both dimensions. Each string treated as one item with two weights."}},

{id:56,num:"LC#139",name:"Word Break",cat:"DP",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"DP",algo:"DP with Hash Set",tags:["dp","string","hashset"],
 concept:"dp[i] = can s[0..i-1] be segmented. For each i: check all j<i where dp[j] true and s[j..i-1] in dictionary.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`boolean wordBreak(String s, List<String> wordDict) {
    return helper(s,new HashSet<>(wordDict),0);
}
boolean helper(String s, Set<String> dict, int start){
    if(start==s.length()) return true;
    for(int end=start+1;end<=s.length();end++)
        if(dict.contains(s.substring(start,end))&&helper(s,dict,end)) return true;
    return false;
}`},
 optimal:{tc:"O(n²×m)",sc:"O(n)",code:`boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict=new HashSet<>(wordDict);
    int n=s.length();
    boolean[] dp=new boolean[n+1]; dp[0]=true;
    for(int i=1;i<=n;i++)
        for(int j=0;j<i;j++)
            if(dp[j]&&dict.contains(s.substring(j,i))){dp[i]=true;break;}
    return dp[n];
}`,note:"Break early (break) when dp[i] found true. dict.contains is O(word_len) with hashing."}},

{id:57,num:"LC#1143",name:"Longest Common Subsequence",cat:"DP",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"DP",algo:"2D DP Table",tags:["dp","string","lcs"],
 concept:"dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]. If chars match: dp[i][j]=dp[i-1][j-1]+1. Else: max of both skip options.",
 brute:{tc:"O(2^(m+n))",sc:"O(m+n)",code:`int lcs(String a, String b, int m, int n){
    if(m==0||n==0) return 0;
    if(a.charAt(m-1)==b.charAt(n-1)) return 1+lcs(a,b,m-1,n-1);
    return Math.max(lcs(a,b,m-1,n),lcs(a,b,m,n-1));
}`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int longestCommonSubsequence(String t1, String t2) {
    int m=t1.length(), n=t2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
        if(t1.charAt(i-1)==t2.charAt(j-1)) dp[i][j]=dp[i-1][j-1]+1;
        else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
    }
    return dp[m][n];
}`,note:"Space optimizable to O(min(m,n)) using two rows. LCS is foundation for diff, edit distance."}},

{id:58,num:"LC#72",name:"Edit Distance (Levenshtein)",cat:"DP",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"2D DP Table",tags:["dp","string"],
 concept:"dp[i][j] = min ops to convert word1[0..i-1] to word2[0..j-1]. 3 operations: insert, delete, replace.",
 brute:{tc:"O(3^(m+n))",sc:"O(m+n)",code:`int minDist(String w1, String w2, int m, int n){
    if(m==0) return n; if(n==0) return m;
    if(w1.charAt(m-1)==w2.charAt(n-1)) return minDist(w1,w2,m-1,n-1);
    return 1+Math.min(minDist(w1,w2,m-1,n-1),Math.min(minDist(w1,w2,m-1,n),minDist(w1,w2,m,n-1)));
}`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int minDistance(String w1, String w2) {
    int m=w1.length(), n=w2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=0;i<=m;i++) dp[i][0]=i;
    for(int j=0;j<=n;j++) dp[0][j]=j;
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
        if(w1.charAt(i-1)==w2.charAt(j-1)) dp[i][j]=dp[i-1][j-1];
        else dp[i][j]=1+Math.min(dp[i-1][j-1],Math.min(dp[i-1][j],dp[i][j-1]));
    }
    return dp[m][n];
}`,note:"Base cases: dp[i][0]=i (delete i chars), dp[0][j]=j (insert j chars)."}},

{id:59,num:"LC#62",name:"Unique Paths",cat:"DP",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"2D DP / Math",tags:["dp","grid","combinatorics"],
 concept:"dp[i][j] = dp[i-1][j] + dp[i][j-1]. Only move right or down. Combinatorics: C(m+n-2, m-1).",
 brute:{tc:"O(2^(m+n))",sc:"O(m+n)",code:`int uniquePaths(int m, int n){
    if(m==1||n==1) return 1;
    return uniquePaths(m-1,n)+uniquePaths(m,n-1);
}`},
 optimal:{tc:"O(mn)",sc:"O(n)",code:`int uniquePaths(int m, int n) {
    int[] dp=new int[n]; Arrays.fill(dp,1);
    for(int i=1;i<m;i++)
        for(int j=1;j<n;j++)
            dp[j]+=dp[j-1];
    return dp[n-1];
}`,note:"1D DP: dp[j] += dp[j-1] (from left). First row/col all 1s (only one path to reach them)."}},

{id:60,num:"LC#64",name:"Minimum Path Sum",cat:"DP",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"2D DP",tags:["dp","grid","path"],
 concept:"dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]. Can modify grid in-place.",
 brute:{tc:"O(2^(m+n))",sc:"O(m+n)",code:`int minPathSum(int[][] grid, int i, int j){
    if(i==0&&j==0) return grid[0][0];
    if(i<0||j<0) return Integer.MAX_VALUE;
    return grid[i][j]+Math.min(minPathSum(grid,i-1,j),minPathSum(grid,i,j-1));
}`},
 optimal:{tc:"O(mn)",sc:"O(1)",code:`int minPathSum(int[][] grid) {
    int m=grid.length, n=grid[0].length;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){
        if(i==0&&j==0) continue;
        if(i==0) grid[i][j]+=grid[i][j-1];
        else if(j==0) grid[i][j]+=grid[i-1][j];
        else grid[i][j]+=Math.min(grid[i-1][j],grid[i][j-1]);
    }
    return grid[m-1][n-1];
}`,note:"Modify grid in-place for O(1) space. Handle first row and column as special cases."}},

{id:61,num:"LC#91",name:"Decode Ways",cat:"DP",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"Linear DP",tags:["dp","string","decode"],
 concept:"dp[i] = ways to decode s[0..i-1]. Single digit decode + two digit decode (if valid). Edge cases: '0' after non-1/2.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`int numDecodings(String s) { return helper(s,0); }
int helper(String s, int i){
    if(i==s.length()) return 1;
    if(s.charAt(i)=='0') return 0;
    int res=helper(s,i+1);
    if(i+1<s.length()){int two=Integer.parseInt(s.substring(i,i+2));if(two<=26)res+=helper(s,i+2);}
    return res;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int numDecodings(String s) {
    int prev2=1, prev1= s.charAt(0)!='0'?1:0;
    for(int i=1;i<s.length();i++){
        int curr=0;
        if(s.charAt(i)!='0') curr=prev1;
        int two=Integer.parseInt(s.substring(i-1,i+1));
        if(two>=10&&two<=26) curr+=prev2;
        prev2=prev1; prev1=curr;
    }
    return prev1;
}`,note:"dp[0]=1 (empty string). '0' digit alone is invalid. Two-digit must be 10-26."}},

{id:62,num:"LC#300",name:"Longest Increasing Subsequence (classic DP)",cat:"DP",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"O(n²) DP → O(n log n) Patience Sort",tags:["dp","binary-search","lis"],
 concept:"dp[i] = length of LIS ending at i. O(n²). Optimized with patience sorting: maintain tails[], binary search.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int lengthOfLIS(int[] nums) {
    int n=nums.length; int[] dp=new int[n]; Arrays.fill(dp,1); int max=1;
    for(int i=1;i<n;i++){for(int j=0;j<i;j++) if(nums[j]<nums[i]) dp[i]=Math.max(dp[i],dp[j]+1);max=Math.max(max,dp[i]);}
    return max;
}`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`int lengthOfLIS(int[] nums) {
    List<Integer> tails=new ArrayList<>();
    for(int n:nums){
        int lo=0,hi=tails.size();
        while(lo<hi){int m=lo+(hi-lo)/2;if(tails.get(m)<n)lo=m+1;else hi=m;}
        if(lo==tails.size())tails.add(n); else tails.set(lo,n);
    }
    return tails.size();
}`,note:"tails[] maintains minimum possible tail for each LIS length. NOT the actual LIS."}},

{id:63,num:"LC#354",name:"Russian Doll Envelopes",cat:"DP",difficulty:"Hard",
 sheets:["Amazon","LeetCode"],
 pattern:"DP",algo:"LIS in 2D (Patience Sort)",tags:["dp","lis","2d","sorting"],
 concept:"Sort by width ASC. If widths equal, sort by height DESC (prevents using same width twice). Then LIS on heights.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int maxEnvelopes(int[][] envelopes) {
    Arrays.sort(envelopes,(a,b)->a[0]==b[0]?b[1]-a[1]:a[0]-b[0]);
    int n=envelopes.length; int[] dp=new int[n]; Arrays.fill(dp,1); int max=1;
    for(int i=1;i<n;i++){for(int j=0;j<i;j++) if(envelopes[j][1]<envelopes[i][1]) dp[i]=Math.max(dp[i],dp[j]+1);max=Math.max(max,dp[i]);}
    return max;
}`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`int maxEnvelopes(int[][] envelopes) {
    Arrays.sort(envelopes,(a,b)->a[0]==b[0]?b[1]-a[1]:a[0]-b[0]);
    List<Integer> tails=new ArrayList<>();
    for(int[] e:envelopes){
        int h=e[1], lo=0, hi=tails.size();
        while(lo<hi){int m=lo+(hi-lo)/2;if(tails.get(m)<h)lo=m+1;else hi=m;}
        if(lo==tails.size())tails.add(h); else tails.set(lo,h);
    }
    return tails.size();
}`,note:"DESC sort on height when width is equal prevents counting same-width envelopes in LIS."}},

/* ══════════════ SECTION 3 — 2D ARRAYS / MATRIX ══════════════ */

{id:64,num:"LC#48",name:"Rotate Matrix 90° Clockwise",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Matrix",algo:"Transpose + Reverse Rows",tags:["matrix","in-place"],
 concept:"Step1: Transpose (swap [i][j] ↔ [j][i]). Step2: Reverse each row. Result = 90° CW rotation. O(1) space.",
 brute:{tc:"O(n²)",sc:"O(n²)",code:`void rotate(int[][] matrix) {
    int n=matrix.length;
    int[][] copy=new int[n][n];
    for(int i=0;i<n;i++) for(int j=0;j<n;j++) copy[j][n-1-i]=matrix[i][j];
    for(int i=0;i<n;i++) for(int j=0;j<n;j++) matrix[i][j]=copy[i][j];
}`},
 optimal:{tc:"O(n²)",sc:"O(1)",code:`void rotate(int[][] matrix) {
    int n=matrix.length;
    for(int i=0;i<n;i++) for(int j=i+1;j<n;j++){int t=matrix[i][j];matrix[i][j]=matrix[j][i];matrix[j][i]=t;}
    for(int[] row:matrix){int lo=0,hi=row.length-1;while(lo<hi){int t=row[lo];row[lo++]=row[hi];row[hi--]=t;}}
}`,note:"For 90° CCW: reverse each row FIRST, then transpose."}},

{id:65,num:"LC#54",name:"Spiral Matrix (Print)",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Matrix",algo:"Layer Peeling / Boundary Simulation",tags:["matrix","simulation"],
 concept:"Maintain top/bottom/left/right boundaries. Traverse → right, ↓ down, ← left, ↑ up. Shrink boundary after each direction.",
 brute:{tc:"O(mn)",sc:"O(mn)",code:`List<Integer> spiralOrder(int[][] matrix) {
    int m=matrix.length,n=matrix[0].length;
    boolean[][] visited=new boolean[m][n];
    int[] dr={0,1,0,-1},dc={1,0,-1,0};
    int r=0,c=0,dir=0; List<Integer> res=new ArrayList<>();
    for(int i=0;i<m*n;i++){
        res.add(matrix[r][c]); visited[r][c]=true;
        int nr=r+dr[dir],nc=c+dc[dir];
        if(nr<0||nr>=m||nc<0||nc>=n||visited[nr][nc]){dir=(dir+1)%4;nr=r+dr[dir];nc=c+dc[dir];}
        r=nr;c=nc;
    }
    return res;
}`},
 optimal:{tc:"O(mn)",sc:"O(1)",code:`List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> res=new ArrayList<>();
    int top=0,bot=matrix.length-1,left=0,right=matrix[0].length-1;
    while(top<=bot&&left<=right){
        for(int i=left;i<=right;i++) res.add(matrix[top][i]); top++;
        for(int i=top;i<=bot;i++) res.add(matrix[i][right]); right--;
        if(top<=bot){for(int i=right;i>=left;i--) res.add(matrix[bot][i]);bot--;}
        if(left<=right){for(int i=bot;i>=top;i--) res.add(matrix[i][left]);left++;}
    }
    return res;
}`,note:"Check top<=bot and left<=right BEFORE bottom/left traversals to avoid duplicates."}},

{id:66,num:"LC#73",name:"Set Matrix Zeroes",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Matrix",algo:"First Row/Col as Markers",tags:["matrix","in-place"],
 concept:"Use first row and first col as markers. BUT first handle whether first row/col themselves have zeros (separate booleans).",
 brute:{tc:"O(mn)",sc:"O(m+n)",code:`void setZeroes(int[][] m) {
    Set<Integer> rows=new HashSet<>(), cols=new HashSet<>();
    for(int i=0;i<m.length;i++) for(int j=0;j<m[0].length;j++) if(m[i][j]==0){rows.add(i);cols.add(j);}
    for(int i=0;i<m.length;i++) for(int j=0;j<m[0].length;j++) if(rows.contains(i)||cols.contains(j)) m[i][j]=0;
}`},
 optimal:{tc:"O(mn)",sc:"O(1)",code:`void setZeroes(int[][] m) {
    int R=m.length,C=m[0].length;
    boolean firstRow=false,firstCol=false;
    for(int j=0;j<C;j++) if(m[0][j]==0) firstRow=true;
    for(int i=0;i<R;i++) if(m[i][0]==0) firstCol=true;
    for(int i=1;i<R;i++) for(int j=1;j<C;j++) if(m[i][j]==0){m[i][0]=0;m[0][j]=0;}
    for(int i=1;i<R;i++) for(int j=1;j<C;j++) if(m[i][0]==0||m[0][j]==0) m[i][j]=0;
    if(firstRow) Arrays.fill(m[0],0);
    if(firstCol) for(int i=0;i<R;i++) m[i][0]=0;
}`,note:"Two separate booleans track whether first row/col had zeros before we use them as markers."}},

{id:67,num:"LC#74",name:"Search a 2D Matrix (Sorted)",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Binary Search",algo:"Binary Search on Flattened Matrix",tags:["binary-search","matrix"],
 concept:"Treat whole matrix as sorted 1D array. mid/cols = row, mid%cols = col. Standard binary search.",
 brute:{tc:"O(mn)",sc:"O(1)",code:`boolean searchMatrix(int[][] m, int target) {
    for(int[] row:m) for(int v:row) if(v==target) return true;
    return false;
}`},
 optimal:{tc:"O(log(mn))",sc:"O(1)",code:`boolean searchMatrix(int[][] m, int target) {
    int r=m.length,c=m[0].length,lo=0,hi=r*c-1;
    while(lo<=hi){
        int mid=lo+(hi-lo)/2, val=m[mid/c][mid%c];
        if(val==target) return true;
        if(val<target) lo=mid+1; else hi=mid-1;
    }
    return false;
}`,note:"mid/c gives row, mid%c gives column. Only works when each row's first > previous row's last."}},

{id:68,num:"LC#240",name:"Search a 2D Matrix II (Rows and Cols Sorted)",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Matrix",algo:"Top-Right Corner Strategy",tags:["matrix","two-pointer"],
 concept:"Start top-right. If current > target → move left (eliminate column). If current < target → move down (eliminate row).",
 brute:{tc:"O(mn)",sc:"O(1)",code:`boolean searchMatrix(int[][] m, int target) {
    for(int[] row:m) for(int v:row) if(v==target) return true;
    return false;
}`},
 optimal:{tc:"O(m+n)",sc:"O(1)",code:`boolean searchMatrix(int[][] m, int target) {
    int r=0, c=m[0].length-1;
    while(r<m.length && c>=0){
        if(m[r][c]==target) return true;
        if(m[r][c]>target) c--; else r++;
    }
    return false;
}`,note:"Top-right: bigger than all in row (→ can eliminate row if too small), smaller than all below (→ can eliminate col if too big)."}},

{id:69,num:"LC#85",name:"Maximal Rectangle in Binary Matrix",cat:"2D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Monotonic Stack",algo:"Histogram per Row + Monotonic Stack",tags:["stack","monotonic","matrix","dp"],
 concept:"Build histogram row-by-row (heights[j] += 1 if '1', reset to 0 if '0'). Apply Largest Rectangle in Histogram on each row.",
 brute:{tc:"O(m²n²)",sc:"O(1)",code:`// Try all O(m²n²) submatrices — too slow`},
 optimal:{tc:"O(mn)",sc:"O(n)",code:`int maximalRectangle(char[][] matrix) {
    if(matrix.length==0) return 0;
    int n=matrix[0].length,max=0;
    int[] heights=new int[n];
    for(char[] row:matrix){
        for(int j=0;j<n;j++) heights[j]=row[j]=='0'?0:heights[j]+1;
        max=Math.max(max,largestRect(heights));
    }
    return max;
}
int largestRect(int[] h){
    Deque<Integer>st=new ArrayDeque<>();int max=0,n=h.length;
    for(int i=0;i<=n;i++){int cur=i==n?0:h[i];while(!st.isEmpty()&&cur<h[st.peek()]){int t=st.pop();int w=st.isEmpty()?i:i-st.peek()-1;max=Math.max(max,h[t]*w);}st.push(i);}
    return max;
}`,note:"Reduce to histogram problem. If cell is '0', height resets to 0 (no continuous 1s above)."}},

{id:70,num:"LC#221",name:"Maximal Square",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"2D DP",tags:["dp","matrix","square"],
 concept:"dp[i][j] = side length of largest square with bottom-right corner at (i,j). dp[i][j] = min(top,left,diagonal)+1 if matrix[i][j]=='1'.",
 brute:{tc:"O(m²n²)",sc:"O(1)",code:`// For each cell, expand square while all 1s — O(m²n²)`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int maximalSquare(char[][] matrix) {
    int m=matrix.length,n=matrix[0].length,max=0;
    int[][] dp=new int[m+1][n+1];
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
        if(matrix[i-1][j-1]=='1'){
            dp[i][j]=Math.min(dp[i-1][j],Math.min(dp[i][j-1],dp[i-1][j-1]))+1;
            max=Math.max(max,dp[i][j]);
        }
    }
    return max*max;
}`,note:"min(top,left,diagonal)+1. The 3 neighbors constrain how large a square can extend. Return area (side²)."}},

{id:71,num:"LC#695",name:"Max Area of Island",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"BFS/DFS",algo:"DFS Flood Fill",tags:["matrix","dfs","graph"],
 concept:"DFS from each '1' cell. Mark visited by setting to 0. Return max area across all islands.",
 brute:{tc:"O(mn)",sc:"O(mn)",code:`// BFS alternative uses queue — same complexity`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int maxAreaOfIsland(int[][] grid) {
    int m=grid.length,n=grid[0].length,max=0;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++)
        if(grid[i][j]==1) max=Math.max(max,dfs(grid,i,j));
    return max;
}
int dfs(int[][] g, int i, int j){
    if(i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]==0) return 0;
    g[i][j]=0;
    return 1+dfs(g,i+1,j)+dfs(g,i-1,j)+dfs(g,i,j+1)+dfs(g,i,j-1);
}`,note:"Modifying input to mark visited avoids extra visited array."}},

{id:72,num:"LC#200",name:"Number of Islands",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"BFS/DFS",algo:"DFS/BFS Flood Fill",tags:["dfs","bfs","matrix","island"],
 concept:"DFS from each unvisited '1'. Mark entire island as visited. Count DFS calls.",
 brute:{tc:"O(mn)",sc:"O(mn)",code:`// BFS approach is same complexity`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int numIslands(char[][] grid) {
    int m=grid.length,n=grid[0].length,count=0;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++)
        if(grid[i][j]=='1'){dfs(grid,i,j);count++;}
    return count;
}
void dfs(char[][] g, int i, int j){
    if(i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]!='1') return;
    g[i][j]='2';
    dfs(g,i+1,j);dfs(g,i-1,j);dfs(g,i,j+1);dfs(g,i,j-1);
}`,note:"Mark as '2' (not '0') to distinguish visited from water. Count each fresh DFS call."}},

{id:73,num:"LC#994",name:"Rotting Oranges",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"BFS/DFS",algo:"Multi-source BFS",tags:["bfs","matrix","multi-source"],
 concept:"Multi-source BFS: start from all rotten oranges simultaneously. BFS level = minutes elapsed. Check if any fresh remain.",
 brute:{tc:"O(mn×max_minutes)",sc:"O(mn)",code:`// Simulate minute by minute, scanning entire grid each time`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int orangesRotting(int[][] grid) {
    int m=grid.length,n=grid[0].length,fresh=0,minutes=0;
    Queue<int[]> q=new LinkedList<>();
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){if(grid[i][j]==2)q.offer(new int[]{i,j});else if(grid[i][j]==1)fresh++;}
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!q.isEmpty()&&fresh>0){
        minutes++;
        for(int k=q.size();k>0;k--){
            int[] cell=q.poll();
            for(int[] d:dirs){int r=cell[0]+d[0],c=cell[1]+d[1];if(r>=0&&r<m&&c>=0&&c<n&&grid[r][c]==1){grid[r][c]=2;fresh--;q.offer(new int[]{r,c});}}
        }
    }
    return fresh==0?minutes:-1;
}`,note:"Multi-source BFS: enqueue ALL rotten oranges first. Each BFS level = 1 minute."}},

{id:74,num:"LC#542",name:"01 Matrix (Distance to Nearest 0)",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"BFS/DFS",algo:"Multi-source BFS",tags:["bfs","matrix","distance"],
 concept:"Multi-source BFS from ALL 0s simultaneously. Distance builds outward level by level.",
 brute:{tc:"O(m²n²)",sc:"O(mn)",code:`// BFS from each cell to find nearest 0 — O(m²n²)`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int[][] updateMatrix(int[][] mat) {
    int m=mat.length,n=mat[0].length;
    int[][] dist=new int[m][n]; Queue<int[]> q=new LinkedList<>();
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){if(mat[i][j]==0)q.offer(new int[]{i,j});else dist[i][j]=Integer.MAX_VALUE;}
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!q.isEmpty()){
        int[] cell=q.poll();
        for(int[] d:dirs){int r=cell[0]+d[0],c=cell[1]+d[1];if(r>=0&&r<m&&c>=0&&c<n&&dist[r][c]>dist[cell[0]][cell[1]]+1){dist[r][c]=dist[cell[0]][cell[1]]+1;q.offer(new int[]{r,c});}}
    }
    return dist;
}`,note:"Start BFS from all 0s at once. 1-cells get their distance from nearest 0 via BFS propagation."}},

{id:75,num:"LC#1091",name:"Shortest Path in Binary Matrix",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"BFS/DFS",algo:"BFS Shortest Path",tags:["bfs","matrix","shortest-path","8-directional"],
 concept:"BFS from (0,0) to (n-1,n-1). 8-directional movement. BFS guarantees shortest path in unweighted grid.",
 brute:{tc:"O(2^mn)",sc:"O(mn)",code:`// DFS tries all paths — exponential in worst case`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int shortestPathBinaryMatrix(int[][] grid) {
    int n=grid.length;
    if(grid[0][0]==1||grid[n-1][n-1]==1) return -1;
    Queue<int[]> q=new LinkedList<>(); q.offer(new int[]{0,0,1}); grid[0][0]=1;
    int[][] dirs={{-1,-1},{-1,0},{-1,1},{0,-1},{0,1},{1,-1},{1,0},{1,1}};
    while(!q.isEmpty()){
        int[] cur=q.poll(); int r=cur[0],c=cur[1],dist=cur[2];
        if(r==n-1&&c==n-1) return dist;
        for(int[] d:dirs){int nr=r+d[0],nc=c+d[1];if(nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]==0){grid[nr][nc]=1;q.offer(new int[]{nr,nc,dist+1});}}
    }
    return -1;
}`,note:"Mark visited by setting to 1. Store distance in queue. 8-directional includes diagonals."}},

{id:76,num:"LC#329",name:"Longest Increasing Path in Matrix",cat:"2D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DFS + Memoization",algo:"DFS + Memoization",tags:["dfs","dp","matrix","topo-sort"],
 concept:"DFS from each cell. Memoize longest path from each cell. No visited array needed (strictly increasing prevents cycles).",
 brute:{tc:"O(mn×2^(mn))",sc:"O(mn)",code:`// DFS without memoization — exponential`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int longestIncreasingPath(int[][] matrix) {
    int m=matrix.length,n=matrix[0].length,max=0;
    int[][] memo=new int[m][n];
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) max=Math.max(max,dfs(matrix,memo,i,j));
    return max;
}
int dfs(int[][] g, int[][] memo, int i, int j){
    if(memo[i][j]!=0) return memo[i][j];
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    int best=1;
    for(int[] d:dirs){int r=i+d[0],c=j+d[1];if(r>=0&&r<g.length&&c>=0&&c<g[0].length&&g[r][c]>g[i][j])best=Math.max(best,1+dfs(g,memo,r,c));}
    return memo[i][j]=best;
}`,note:"Strictly increasing values prevent cycles → no visited array needed. Memoize makes it O(mn)."}},

{id:77,num:"LC#289",name:"Game of Life",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Matrix",algo:"In-place Bit Encoding",tags:["matrix","simulation"],
 concept:"Encode next state in 2nd bit (bit1=current, bit2=next). Two-pass: encode transitions, then shift right.",
 brute:{tc:"O(mn)",sc:"O(mn)",code:`void gameOfLife(int[][] b) {
    int R=b.length,C=b[0].length; int[][] copy=new int[R][C];
    for(int[] row:b) copy[Arrays.binarySearch(b,row)]=row.clone();
    // update b based on copy
}`},
 optimal:{tc:"O(mn)",sc:"O(1)",code:`void gameOfLife(int[][] b) {
    int R=b.length,C=b[0].length;
    int[] dr={-1,-1,-1,0,0,1,1,1},dc={-1,0,1,-1,1,-1,0,1};
    for(int i=0;i<R;i++) for(int j=0;j<C;j++){
        int live=0;
        for(int k=0;k<8;k++){int r=i+dr[k],c=j+dc[k];if(r>=0&&r<R&&c>=0&&c<C&&(b[r][c]&1)==1)live++;}
        if((b[i][j]&1)==1&&(live==2||live==3)) b[i][j]|=2;
        if((b[i][j]&1)==0&&live==3) b[i][j]|=2;
    }
    for(int i=0;i<R;i++) for(int j=0;j<C;j++) b[i][j]>>=1;
}`,note:"(b[r][c]&1) reads current state. Bit OR 2 sets future state. Final right shift extracts future as current."}},

{id:78,num:"LC#36",name:"Valid Sudoku",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"3×3 Box Index Trick",tags:["matrix","hashset"],
 concept:"Check each row, column, and 3×3 box for duplicates. Box index = (row/3)*3 + col/3.",
 brute:{tc:"O(1)",sc:"O(1)",code:`// 81 fixed cells — check all rows, cols, boxes separately`},
 optimal:{tc:"O(1)",sc:"O(1)",code:`boolean isValidSudoku(char[][] board) {
    Set<String> seen=new HashSet<>();
    for(int i=0;i<9;i++) for(int j=0;j<9;j++){
        char c=board[i][j]; if(c=='.') continue;
        String row="R"+i+c, col="C"+j+c, box="B"+(i/3)+(j/3)+c;
        if(!seen.add(row)||!seen.add(col)||!seen.add(box)) return false;
    }
    return true;
}`,note:"Box index: (i/3)*3+(j/3) maps each cell to its 3×3 box (0-8). String encoding prevents false collisions."}},

{id:79,num:"LC#130",name:"Surrounded Regions",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"BFS/DFS",algo:"Reverse DFS from Border",tags:["dfs","matrix","boundary"],
 concept:"Any 'O' connected to border cannot be flipped. DFS from all border 'O's, mark as safe. Then flip remaining 'O' to 'X'.",
 brute:{tc:"O(mn)",sc:"O(mn)",code:`// DFS from each 'O', check if it reaches border — O(mn) per cell`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`void solve(char[][] board) {
    int m=board.length,n=board[0].length;
    for(int i=0;i<m;i++){dfs(board,i,0);dfs(board,i,n-1);}
    for(int j=0;j<n;j++){dfs(board,0,j);dfs(board,m-1,j);}
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){
        if(board[i][j]=='O') board[i][j]='X';
        else if(board[i][j]=='S') board[i][j]='O';
    }
}
void dfs(char[][] b, int i, int j){
    if(i<0||i>=b.length||j<0||j>=b[0].length||b[i][j]!='O') return;
    b[i][j]='S'; dfs(b,i+1,j);dfs(b,i-1,j);dfs(b,i,j+1);dfs(b,i,j-1);
}`,note:"Mark border-connected 'O' as 'S' (safe). After processing: 'O'→'X', 'S'→'O'."}},

{id:80,num:"LC#2352",name:"Equal Row and Column Pairs",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"HashMap",algo:"HashMap of Row/Col Signatures",tags:["matrix","hashmap"],
 concept:"Convert each row to string key, count in map. For each column, generate string key, look up in map.",
 brute:{tc:"O(n³)",sc:"O(1)",code:`int equalPairs(int[][] grid) {
    int n=grid.length,count=0;
    for(int i=0;i<n;i++) for(int j=0;j<n;j++){
        boolean match=true;
        for(int k=0;k<n;k++) if(grid[i][k]!=grid[k][j]){match=false;break;}
        if(match) count++;
    }
    return count;
}`},
 optimal:{tc:"O(n²)",sc:"O(n²)",code:`int equalPairs(int[][] grid) {
    int n=grid.length; Map<String,Integer> rowCount=new HashMap<>();
    for(int[] row:grid) rowCount.merge(Arrays.toString(row),1,Integer::sum);
    int count=0;
    for(int j=0;j<n;j++){
        int[] col=new int[n];
        for(int i=0;i<n;i++) col[i]=grid[i][j];
        count+=rowCount.getOrDefault(Arrays.toString(col),0);
    }
    return count;
}`,note:"Arrays.toString() creates consistent string key. Column extraction requires building int[] first."}},

{id:81,num:"LC#1351",name:"Count Negative Numbers in Sorted Matrix",cat:"2D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Binary Search",algo:"Staircase O(m+n)",tags:["binary-search","matrix"],
 concept:"Start top-right. If negative: all elements below are also negative (count += rows remaining), move left. Else move down.",
 brute:{tc:"O(mn)",sc:"O(1)",code:`int countNegatives(int[][] grid) {
    int count=0;
    for(int[] row:grid) for(int v:row) if(v<0) count++;
    return count;
}`},
 optimal:{tc:"O(m+n)",sc:"O(1)",code:`int countNegatives(int[][] grid) {
    int m=grid.length,n=grid[0].length,r=0,c=n-1,count=0;
    while(r<m&&c>=0){
        if(grid[r][c]<0){ count+=m-r; c--; }
        else r++;
    }
    return count;
}`,note:"Staircase approach: top-right corner eliminates row or column at each step."}},

{id:82,num:"LC#2661",name:"First Completely Painted Row or Column",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"HashMap + Row/Col Counter",tags:["matrix","hashmap","painting"],
 concept:"Map each value to its (row,col). Track row/col paint counts. When row count = cols or col count = rows → fully painted.",
 brute:{tc:"O(mn×(m+n))",sc:"O(mn)",code:`// For each painted cell, check if row/col complete — O(mn×(m+n))`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int firstCompleteIndex(int[] arr, int[][] mat) {
    int m=mat.length,n=mat[0].length;
    Map<Integer,int[]> pos=new HashMap<>();
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) pos.put(mat[i][j],new int[]{i,j});
    int[] rowCnt=new int[m],colCnt=new int[n];
    for(int k=0;k<arr.length;k++){
        int[] rc=pos.get(arr[k]); int r=rc[0],c=rc[1];
        if(++rowCnt[r]==n||++colCnt[c]==m) return k;
    }
    return -1;
}`,note:"Pre-map values to positions for O(1) lookup. Increment counters and check completion eagerly."}},

/* ══════════════ SECTION 4 — STRING PROBLEMS ══════════════ */

{id:83,num:"LC#5",name:"Longest Palindromic Substring",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Two Pointer",algo:"Expand Around Center",tags:["two-pointer","string","palindrome"],
 concept:"For each center (n for odd, n-1 for even), expand while palindrome. Track max. O(n²) time O(1) space.",
 brute:{tc:"O(n³)",sc:"O(1)",code:`String longestPalindrome(String s) {
    String res="";
    for(int i=0;i<s.length();i++) for(int j=i;j<s.length();j++){
        String sub=s.substring(i,j+1);
        if(isPalin(sub)&&sub.length()>res.length()) res=sub;
    }
    return res;
}`},
 optimal:{tc:"O(n²)",sc:"O(1)",code:`String longestPalindrome(String s) {
    int start=0,maxLen=1;
    for(int i=0;i<s.length();i++){
        int odd=expand(s,i,i), even=expand(s,i,i+1);
        int len=Math.max(odd,even);
        if(len>maxLen){maxLen=len;start=i-(len-1)/2;}
    }
    return s.substring(start,start+maxLen);
}
int expand(String s,int lo,int hi){
    while(lo>=0&&hi<s.length()&&s.charAt(lo)==s.charAt(hi)){lo--;hi++;}
    return hi-lo-1;
}`,note:"2n-1 centers (n odd + n-1 even). Manacher's algo is O(n) but rarely needed in interviews."}},

{id:84,num:"LC#647",name:"Palindromic Substrings (Count)",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Expand Around Center",tags:["two-pointer","string","palindrome"],
 concept:"Same expand-around-center. Count all valid palindromes instead of tracking longest.",
 brute:{tc:"O(n³)",sc:"O(1)",code:`int countSubstrings(String s) {
    int count=0;
    for(int i=0;i<s.length();i++) for(int j=i;j<s.length();j++) if(isPalin(s,i,j)) count++;
    return count;
}`},
 optimal:{tc:"O(n²)",sc:"O(1)",code:`int countSubstrings(String s) {
    int count=0;
    for(int i=0;i<s.length();i++){
        count+=expandCount(s,i,i);
        count+=expandCount(s,i,i+1);
    }
    return count;
}
int expandCount(String s,int lo,int hi){
    int cnt=0;
    while(lo>=0&&hi<s.length()&&s.charAt(lo)==s.charAt(hi)){cnt++;lo--;hi++;}
    return cnt;
}`,note:"Each expansion yields one palindrome. Count includes single chars (base case)."}},

{id:85,num:"LC#49",name:"Group Anagrams",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"HashMap",algo:"Sort Key / Frequency Key",tags:["hashmap","string"],
 concept:"Key = sorted string. All anagrams → same sorted form. HashMap groups by key.",
 brute:{tc:"O(n²×m log m)",sc:"O(nm)",code:`// Check each pair if anagram — O(n²×m log m)`},
 optimal:{tc:"O(n×m log m)",sc:"O(nm)",code:`List<List<String>> groupAnagrams(String[] strs) {
    Map<String,List<String>> map=new HashMap<>();
    for(String s:strs){
        char[] c=s.toCharArray(); Arrays.sort(c);
        String key=new String(c);
        map.computeIfAbsent(key,k->new ArrayList<>()).add(s);
    }
    return new ArrayList<>(map.values());
}`,note:"Sorted string is canonical. Alternative: frequency-based key avoids sort → O(nm) time."}},

{id:86,num:"LC#567",name:"Permutation in String",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Sliding Window",algo:"Fixed Window Frequency",tags:["sliding-window","string"],
 concept:"Fixed window of s1.length(). Compare frequency arrays. Slide: add right char, remove left char. Arrays.equals is O(26)=O(1).",
 brute:{tc:"O(n×m!)",sc:"O(m)",code:`// Generate all permutations of s1, check if any is substring`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean checkInclusion(String s1, String s2) {
    if(s1.length()>s2.length()) return false;
    int[] c1=new int[26],c2=new int[26]; int k=s1.length();
    for(char c:s1.toCharArray()) c1[c-'a']++;
    for(int i=0;i<k;i++) c2[s2.charAt(i)-'a']++;
    if(Arrays.equals(c1,c2)) return true;
    for(int i=k;i<s2.length();i++){
        c2[s2.charAt(i)-'a']++;
        c2[s2.charAt(i-k)-'a']--;
        if(Arrays.equals(c1,c2)) return true;
    }
    return false;
}`,note:"Arrays.equals on size-26 arrays is O(1). Fixed window = s1.length()."}},

{id:87,num:"LC#438",name:"Find All Anagrams in a String",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Sliding Window",algo:"Fixed Window Frequency",tags:["sliding-window","frequency","anagram"],
 concept:"Same as Permutation in String. Collect all starting indices where frequency arrays match.",
 brute:{tc:"O(n×m!)",sc:"O(m)",code:`// Generate all permutations, find all occurrences — exponential`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`List<Integer> findAnagrams(String s, String p) {
    List<Integer> res=new ArrayList<>();
    if(s.length()<p.length()) return res;
    int[] cp=new int[26],cs=new int[26]; int k=p.length();
    for(char c:p.toCharArray()) cp[c-'a']++;
    for(int i=0;i<k;i++) cs[s.charAt(i)-'a']++;
    if(Arrays.equals(cp,cs)) res.add(0);
    for(int i=k;i<s.length();i++){
        cs[s.charAt(i)-'a']++;
        cs[s.charAt(i-k)-'a']--;
        if(Arrays.equals(cp,cs)) res.add(i-k+1);
    }
    return res;
}`,note:"Identical to Permutation in String but collect all valid window start indices."}},

{id:88,num:"LC#20",name:"Valid Parentheses",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Monotonic Stack",algo:"Stack",tags:["stack","string"],
 concept:"Push opening brackets. On closing bracket: if stack empty or top doesn't match → invalid. Stack empty at end → valid.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`boolean isValid(String s) {
    while(s.contains("()")||s.contains("[]")||s.contains("{}")){
        s=s.replace("()","").replace("[]","").replace("{}","");
    }
    return s.isEmpty();
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`boolean isValid(String s) {
    Deque<Character> stack=new ArrayDeque<>();
    for(char c:s.toCharArray()){
        if(c=='('||c=='['||c=='{') stack.push(c);
        else{
            if(stack.isEmpty()) return false;
            char top=stack.pop();
            if(c==')'&&top!='(') return false;
            if(c==']'&&top!='[') return false;
            if(c=='}'&&top!='{') return false;
        }
    }
    return stack.isEmpty();
}`,note:"Stack must be empty at end — all opened brackets must be closed."}},

{id:89,num:"LC#394",name:"Decode String",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Monotonic Stack",algo:"Stack",tags:["stack","encoding","recursion"],
 concept:"Stack stores (prevString, repeatCount). On '[': push current state. On ']': pop and repeat current string repeatCount times.",
 brute:{tc:"O(n×maxK)",sc:"O(n)",code:`// Recursive parsing — same complexity but harder to implement`},
 optimal:{tc:"O(n×maxK)",sc:"O(n)",code:`String decodeString(String s) {
    Deque<String> strStack=new ArrayDeque<>();
    Deque<Integer> numStack=new ArrayDeque<>();
    StringBuilder curr=new StringBuilder(); int k=0;
    for(char c:s.toCharArray()){
        if(Character.isDigit(c)) k=k*10+(c-'0');
        else if(c=='['){strStack.push(curr.toString());numStack.push(k);curr=new StringBuilder();k=0;}
        else if(c==']'){
            String prev=strStack.pop(); int times=numStack.pop();
            StringBuilder rep=new StringBuilder(prev);
            for(int i=0;i<times;i++) rep.append(curr);
            curr=rep;
        } else curr.append(c);
    }
    return curr.toString();
}`,note:"Two stacks: one for strings, one for counts. k=k*10+(c-'0') handles multi-digit numbers."}},

{id:90,num:"LC#32",name:"Longest Valid Parentheses",cat:"String",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Monotonic Stack",algo:"Stack / DP",tags:["stack","dp","parentheses"],
 concept:"Stack stores indices. Push index of '(' or invalid ')'. Max gap between consecutive stack elements = valid substring length.",
 brute:{tc:"O(n³)",sc:"O(n)",code:`int longestValidParentheses(String s) {
    int max=0;
    for(int i=0;i<s.length();i++) for(int j=i+2;j<=s.length();j+=2) if(isValid(s.substring(i,j))) max=j-i;
    return max;
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int longestValidParentheses(String s) {
    Deque<Integer> stack=new ArrayDeque<>(); stack.push(-1);
    int max=0;
    for(int i=0;i<s.length();i++){
        if(s.charAt(i)=='(') stack.push(i);
        else{
            stack.pop();
            if(stack.isEmpty()) stack.push(i);
            else max=Math.max(max,i-stack.peek());
        }
    }
    return max;
}`,note:"Initialize stack with -1 as base. On ')': pop; if stack empty push current i as new base; else gap = i - stack.peek()."}},

{id:91,num:"LC#227",name:"Basic Calculator II",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Monotonic Stack",algo:"Stack (No Parentheses)",tags:["stack","expression","precedence"],
 concept:"Process operators with precedence. '+'/'-': push to stack. '*'/'/': pop top, compute, push result. Sum stack at end.",
 brute:{tc:"O(n)",sc:"O(n)",code:`// Parse and evaluate — same complexity`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int calculate(String s) {
    Deque<Integer> stack=new ArrayDeque<>();
    int num=0; char op='+';
    for(int i=0;i<s.length();i++){
        char c=s.charAt(i);
        if(Character.isDigit(c)) num=num*10+(c-'0');
        if((!Character.isDigit(c)&&c!=' ')||i==s.length()-1){
            if(op=='+') stack.push(num);
            else if(op=='-') stack.push(-num);
            else if(op=='*') stack.push(stack.pop()*num);
            else stack.push(stack.pop()/num);
            op=c; num=0;
        }
    }
    int res=0; while(!stack.isEmpty()) res+=stack.pop();
    return res;
}`,note:"Process at operator or end. '+'/'-' push directly. '*'/'/' operate on top of stack immediately."}},

{id:92,num:"LC#28",name:"Find the Index of the First Occurrence (KMP)",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"String",algo:"KMP Algorithm",tags:["string","kmp"],
 concept:"KMP: build failure function (partial match table), then scan. O(n+m). LPS allows skipping recomparisons.",
 brute:{tc:"O(nm)",sc:"O(1)",code:`int strStr(String haystack, String needle) {
    for(int i=0;i<=haystack.length()-needle.length();i++)
        if(haystack.substring(i,i+needle.length()).equals(needle)) return i;
    return -1;
}`},
 optimal:{tc:"O(n+m)",sc:"O(m)",code:`int strStr(String text, String pat) {
    if(pat.isEmpty()) return 0;
    int m=pat.length(); int[] lps=new int[m];
    for(int i=1,j=0;i<m;){
        if(pat.charAt(i)==pat.charAt(j)){lps[i++]=++j;}
        else if(j>0)j=lps[j-1]; else i++;
    }
    for(int i=0,j=0;i<text.length();){
        if(text.charAt(i)==pat.charAt(j)){i++;j++;}
        if(j==m) return i-j;
        else if(i<text.length()&&text.charAt(i)!=pat.charAt(j))
            j=(j>0)?lps[j-1]:0;
    }
    return -1;
}`,note:"LPS (Longest Proper Prefix Suffix) allows skipping recomparisons. Critical for O(n+m) guarantee."}},

{id:93,num:"LC#242",name:"Valid Anagram",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"HashMap",algo:"Frequency Array",tags:["hashmap","string"],
 concept:"Count char frequencies. Increment for s, decrement for t. Any non-zero means not anagram.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`boolean isAnagram(String s, String t) {
    char[] sc=s.toCharArray(), tc=t.toCharArray();
    Arrays.sort(sc); Arrays.sort(tc);
    return Arrays.equals(sc,tc);
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean isAnagram(String s, String t) {
    if(s.length()!=t.length()) return false;
    int[] freq=new int[26];
    for(char c:s.toCharArray()) freq[c-'a']++;
    for(char c:t.toCharArray()) freq[c-'a']--;
    for(int f:freq) if(f!=0) return false;
    return true;
}`,note:"O(1) space since freq array always size 26. For Unicode: use HashMap instead."}},

{id:94,num:"LC#125",name:"Valid Palindrome",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Two Pointer on String",tags:["two-pointer","string"],
 concept:"Two pointers from both ends. Skip non-alphanumeric. Compare chars case-insensitively.",
 brute:{tc:"O(n)",sc:"O(n)",code:`boolean isPalindrome(String s) {
    StringBuilder sb=new StringBuilder();
    for(char c:s.toCharArray()) if(Character.isLetterOrDigit(c)) sb.append(Character.toLowerCase(c));
    String cleaned=sb.toString();
    return cleaned.equals(new StringBuilder(cleaned).reverse().toString());
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean isPalindrome(String s) {
    int lo=0,hi=s.length()-1;
    while(lo<hi){
        while(lo<hi&&!Character.isLetterOrDigit(s.charAt(lo))) lo++;
        while(lo<hi&&!Character.isLetterOrDigit(s.charAt(hi))) hi--;
        if(Character.toLowerCase(s.charAt(lo))!=Character.toLowerCase(s.charAt(hi))) return false;
        lo++;hi--;
    }
    return true;
}`,note:"Character.isLetterOrDigit() handles all alphanumeric. toLowerCase() for case-insensitive comparison."}},

{id:95,num:"LC#680",name:"Valid Palindrome II",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Two Pointer",algo:"Two Pointer with One Skip",tags:["two-pointer","string"],
 concept:"Two pointer. On mismatch: try removing left OR removing right char. Check if either result is palindrome.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`boolean validPalindrome(String s) {
    for(int i=0;i<s.length();i++){
        String t=s.substring(0,i)+s.substring(i+1);
        if(isPalin(t)) return true;
    }
    return isPalin(s);
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean validPalindrome(String s) {
    int lo=0,hi=s.length()-1;
    while(lo<hi){
        if(s.charAt(lo)!=s.charAt(hi))
            return isPalin(s,lo+1,hi)||isPalin(s,lo,hi-1);
        lo++;hi--;
    }
    return true;
}
boolean isPalin(String s,int lo,int hi){
    while(lo<hi){if(s.charAt(lo++)!=s.charAt(hi--))return false;}return true;
}`,note:"At most ONE removal allowed. On mismatch, the removed char is either lo or hi — try both."}},

{id:96,num:"LC#1143",name:"LCS (Longest Common Subsequence) — String DP",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"2D DP Table",tags:["dp","lcs","string"],
 concept:"Foundation for diff, edit distance, shortest common supersequence. dp[i][j] from top-left to bottom-right.",
 brute:{tc:"O(2^(m+n))",sc:"O(m+n)",code:`int lcs(String a, String b, int m, int n){
    if(m==0||n==0) return 0;
    if(a.charAt(m-1)==b.charAt(n-1)) return 1+lcs(a,b,m-1,n-1);
    return Math.max(lcs(a,b,m-1,n),lcs(a,b,m,n-1));
}`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int longestCommonSubsequence(String t1, String t2) {
    int m=t1.length(),n=t2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
        if(t1.charAt(i-1)==t2.charAt(j-1)) dp[i][j]=dp[i-1][j-1]+1;
        else dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]);
    }
    return dp[m][n];
}`,note:"Space optimizable to O(min(m,n)) using rolling two rows."}},

{id:97,num:"LC#72",name:"Edit Distance — String DP",cat:"String",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"2D DP Table",tags:["dp","string","levenshtein"],
 concept:"3 operations: insert, delete, replace. dp[i][j] = min ops. Base: dp[i][0]=i, dp[0][j]=j.",
 brute:{tc:"O(3^(m+n))",sc:"O(m+n)",code:`// Recursive without memoization — exponential`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int minDistance(String w1, String w2) {
    int m=w1.length(),n=w2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=0;i<=m;i++) dp[i][0]=i;
    for(int j=0;j<=n;j++) dp[0][j]=j;
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
        if(w1.charAt(i-1)==w2.charAt(j-1)) dp[i][j]=dp[i-1][j-1];
        else dp[i][j]=1+Math.min(dp[i-1][j-1],Math.min(dp[i-1][j],dp[i][j-1]));
    }
    return dp[m][n];
}`,note:"dp[i-1][j-1]=replace, dp[i-1][j]=delete, dp[i][j-1]=insert. Min of three + 1."}},

{id:98,num:"LC#151",name:"Reverse Words in a String",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Two Pointer / Split & Join",tags:["two-pointer","string"],
 concept:"Trim, split on whitespace regex, reverse array, join. Or: reverse whole string, reverse each word.",
 brute:{tc:"O(n)",sc:"O(n)",code:`String reverseWords(String s) { return String.join(" ", s.trim().split("\\s+")); /* then reverse */}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`String reverseWords(String s) {
    String[] words=s.trim().split("\\s+");
    StringBuilder sb=new StringBuilder();
    for(int i=words.length-1;i>=0;i--){
        sb.append(words[i]);
        if(i>0) sb.append(" ");
    }
    return sb.toString();
}`,note:"\\s+ handles multiple consecutive spaces. String.split() with \\s+ is cleaner."}},

{id:99,num:"LC#443",name:"String Compression",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Two Pointer In-place",tags:["two-pointer","string"],
 concept:"Write pointer w. Count consecutive same chars, write char then count (if >1) as individual digits.",
 brute:{tc:"O(n)",sc:"O(n)",code:`// Build new string then copy back`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int compress(char[] chars) {
    int write=0,i=0;
    while(i<chars.length){
        char c=chars[i]; int count=0;
        while(i<chars.length&&chars[i]==c){i++;count++;}
        chars[write++]=c;
        if(count>1){ String cnt=String.valueOf(count); for(char d:cnt.toCharArray()) chars[write++]=d; }
    }
    return write;
}`,note:"Write digits of count individually (e.g., 12 → '1','2'). Pointer write always <= read pointer i."}},

{id:100,num:"LC#1657",name:"Determine if Two Strings Are Close",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"HashMap",algo:"Frequency Signature",tags:["hashmap","string"],
 concept:"Two strings are close iff: (1) same set of distinct characters, (2) same multiset of frequencies.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`// Sort frequency arrays and compare, check char sets`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean closeStrings(String w1, String w2) {
    if(w1.length()!=w2.length()) return false;
    int[] f1=new int[26],f2=new int[26];
    for(char c:w1.toCharArray()) f1[c-'a']++;
    for(char c:w2.toCharArray()) f2[c-'a']--;
    for(int i=0;i<26;i++) if((f1[i]==0)!=(f2[i]==0)) return false;
    Arrays.sort(f1); Arrays.sort(f2);
    return Arrays.equals(f1,f2);
}`,note:"Both conditions necessary and sufficient. Sort frequency arrays to compare multisets."}},

/* ══════════════ SECTION 5 — GREEDY ══════════════ */

{id:101,num:"LC#55",name:"Jump Game I",cat:"Greedy",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Greedy",algo:"Greedy Max Reach",tags:["greedy"],
 concept:"Track maxReach = farthest reachable. If current index > maxReach, we're stuck — return false.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`boolean canJump(int[] nums) { return helper(nums,0); }
boolean helper(int[] nums, int i){
    if(i>=nums.length-1) return true;
    for(int j=1;j<=nums[i];j++) if(helper(nums,i+j)) return true;
    return false;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean canJump(int[] nums) {
    int maxReach=0;
    for(int i=0;i<nums.length;i++){
        if(i>maxReach) return false;
        maxReach=Math.max(maxReach,i+nums[i]);
    }
    return true;
}`,note:"maxReach = farthest reachable from any visited position. If i exceeds it we're stuck forever."}},

{id:102,num:"LC#621",name:"Task Scheduler",cat:"Greedy",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Greedy",algo:"Greedy + Math",tags:["greedy","frequency","cooldown"],
 concept:"Most frequent task determines minimum time. Formula: max(n, (maxFreq-1)*(n+1) + countOfMaxFreq).",
 brute:{tc:"O(n×totalTime)",sc:"O(n)",code:`// Simulate scheduling with priority queue — O(n×totalTime)`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int leastInterval(char[] tasks, int n) {
    int[] freq=new int[26];
    for(char t:tasks) freq[t-'A']++;
    Arrays.sort(freq);
    int maxFreq=freq[25];
    int idleSlots=(maxFreq-1)*(n+1);
    int maxCount=0;
    for(int f:freq) if(f==maxFreq) maxCount++;
    idleSlots+=maxCount;
    return Math.max(idleSlots,tasks.length);
}`,note:"(maxFreq-1) full cycles of (n+1) slots, plus last partial cycle. Max with tasks.length handles no-idle case."}},

{id:103,num:"LC#763",name:"Partition Labels",cat:"Greedy",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Greedy",algo:"Greedy Last Occurrence",tags:["greedy","last-occurrence","intervals"],
 concept:"Each partition: extend until we've included the last occurrence of every char seen. Track maxEnd greedily.",
 brute:{tc:"O(n²)",sc:"O(26)",code:`// For each position, find partition boundary by scanning forward`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`List<Integer> partitionLabels(String s) {
    int[] last=new int[26];
    for(int i=0;i<s.length();i++) last[s.charAt(i)-'a']=i;
    List<Integer> res=new ArrayList<>();
    int start=0,end=0;
    for(int i=0;i<s.length();i++){
        end=Math.max(end,last[s.charAt(i)-'a']);
        if(i==end){res.add(end-start+1);start=i+1;}
    }
    return res;
}`,note:"Precompute last occurrence of each char. Extend partition end as we encounter chars."}},

{id:104,num:"LC#402",name:"Remove K Digits",cat:"Greedy",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Greedy",algo:"Monotonic Stack",tags:["greedy","stack","monotonic"],
 concept:"Maintain monotonic increasing stack. Remove larger digits from top when current is smaller. Remove remaining from end if k>0.",
 brute:{tc:"O(n×k)",sc:"O(n)",code:`// Try all combinations of k removals — exponential`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`String removeKdigits(String num, int k) {
    Deque<Character> stack=new ArrayDeque<>();
    for(char c:num.toCharArray()){
        while(k>0&&!stack.isEmpty()&&stack.peek()>c){stack.pop();k--;}
        stack.push(c);
    }
    while(k-->0) stack.pop();
    StringBuilder sb=new StringBuilder();
    while(!stack.isEmpty()) sb.append(stack.pop());
    sb.reverse();
    while(sb.length()>1&&sb.charAt(0)=='0') sb.deleteCharAt(0);
    return sb.isEmpty()?"0":sb.toString();
}`,note:"Monotonic increasing stack gives lexicographically smallest result. Remove leading zeros after."}},

{id:105,num:"LC#253",name:"Meeting Rooms II",cat:"Greedy",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Greedy",algo:"Min-Heap / Sweep Line",tags:["greedy","heap","intervals"],
 concept:"Sort by start. Min-heap tracks end times of active meetings. If current start >= heap.peek, reuse room. Else add new room.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// For each meeting check overlap with all others`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`int minMeetingRooms(int[][] intervals) {
    Arrays.sort(intervals,(a,b)->a[0]-b[0]);
    PriorityQueue<Integer> pq=new PriorityQueue<>();
    for(int[] iv:intervals){
        if(!pq.isEmpty()&&pq.peek()<=iv[0]) pq.poll();
        pq.offer(iv[1]);
    }
    return pq.size();
}`,note:"Heap size = rooms in use. Compare start with earliest ending room. Reuse if meeting ended."}},

{id:106,num:"LC#316",name:"Remove Duplicate Letters",cat:"Greedy",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Greedy",algo:"Monotonic Stack + Frequency",tags:["greedy","stack","lexicographic"],
 concept:"Greedy: build smallest lexicographic result. Pop larger chars from stack if they appear later. Never remove char's only occurrence.",
 brute:{tc:"O(n!)",sc:"O(n)",code:`// Try all permutations of unique chars — exponential`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`String removeDuplicateLetters(String s) {
    int[] cnt=new int[26]; boolean[] inStack=new boolean[26];
    for(char c:s.toCharArray()) cnt[c-'a']++;
    Deque<Character> stack=new ArrayDeque<>();
    for(char c:s.toCharArray()){
        cnt[c-'a']--;
        if(inStack[c-'a']) continue;
        while(!stack.isEmpty()&&stack.peek()>c&&cnt[stack.peek()-'a']>0){inStack[stack.pop()-'a']=false;}
        stack.push(c); inStack[c-'a']=true;
    }
    StringBuilder sb=new StringBuilder();
    while(!stack.isEmpty()) sb.append(stack.pop());
    return sb.reverse().toString();
}`,note:"Only pop if remaining count > 0 (char appears again later). inStack prevents duplicates."}},

{id:107,num:"LC#1642",name:"Furthest Building You Can Reach",cat:"Greedy",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Greedy",algo:"Greedy + Min-Heap",tags:["greedy","heap","ladders"],
 concept:"Use ladders for largest jumps, bricks for smaller ones. Min-heap tracks ladder-used jumps. Swap smallest ladder-jump with bricks.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`// Try all combinations of ladder/brick usage — exponential`},
 optimal:{tc:"O(n log k)",sc:"O(k)",code:`int furthestBuilding(int[] heights, int bricks, int ladders) {
    PriorityQueue<Integer> pq=new PriorityQueue<>();
    for(int i=0;i<heights.length-1;i++){
        int diff=heights[i+1]-heights[i];
        if(diff<=0) continue;
        pq.offer(diff);
        if(pq.size()>ladders) bricks-=pq.poll();
        if(bricks<0) return i;
    }
    return heights.length-1;
}`,note:"Heap stores jumps where ladders are used. When heap exceeds ladders, swap smallest with bricks."}},

{id:108,num:"LC#452",name:"Minimum Arrows to Burst Balloons",cat:"Greedy",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Greedy",algo:"Greedy Sort by End",tags:["greedy","intervals","sorting"],
 concept:"Sort by end. One arrow can burst all balloons overlapping the current balloon's end. Advance when gap found.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// Try all arrow positions — O(n²)`},
 optimal:{tc:"O(n log n)",sc:"O(1)",code:`int findMinArrowShots(int[][] points) {
    Arrays.sort(points,(a,b)->Integer.compare(a[1],b[1]));
    int arrows=1, end=points[0][1];
    for(int i=1;i<points.length;i++){
        if(points[i][0]>end){arrows++;end=points[i][1];}
    }
    return arrows;
}`,note:"Sort by end (use Integer.compare to avoid overflow). Arrow at current balloon's end bursts all overlapping ones."}},

{id:109,num:"LC#406",name:"Queue Reconstruction by Height",cat:"Greedy",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Greedy",algo:"Greedy Sort + Insert",tags:["greedy","sorting","insertion"],
 concept:"Sort by height DESC, then by k ASC. Insert each person at index k. Taller people already placed won't be disturbed.",
 brute:{tc:"O(n!)",sc:"O(n)",code:`// Try all permutations, check if valid reconstruction`},
 optimal:{tc:"O(n²)",sc:"O(n)",code:`int[][] reconstructQueue(int[][] people) {
    Arrays.sort(people,(a,b)->a[0]==b[0]?a[1]-b[1]:b[0]-a[0]);
    List<int[]> res=new ArrayList<>();
    for(int[] p:people) res.add(p[1],p);
    return res.toArray(new int[0][]);
}`,note:"Sort DESC by height, then ASC by k. Insert at index k — shorter people inserted later don't affect count of taller."}},

{id:110,num:"LC#1005",name:"Maximize Sum After K Negations",cat:"Greedy",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Greedy",algo:"Greedy Sort",tags:["greedy","negation"],
 concept:"Sort array. Negate negative numbers from smallest first. If k still > 0, flip smallest absolute value repeatedly (even flips cancel).",
 brute:{tc:"O(2^n×n)",sc:"O(n)",code:`// Try all 2^n sign combinations for k negations`},
 optimal:{tc:"O(n log n)",sc:"O(1)",code:`int largestSumAfterKNegations(int[] nums, int k) {
    Arrays.sort(nums);
    for(int i=0;i<nums.length&&k>0&&nums[i]<0;i++){nums[i]=-nums[i];k--;}
    Arrays.sort(nums);
    if(k%2==1) nums[0]=-nums[0];
    int sum=0; for(int n:nums) sum+=n;
    return sum;
}`,note:"After negating all negatives, if k is still odd, flip minimum element (smallest absolute value) once."}},

  {
    "id": 111, "num": "CF-136A", "name": "Presents", "cat": "1D Array", "difficulty": "Easy",
    "day": 1, "topic": "Arrays & Two Pointers", "sheets": ["Amazon"], "pattern": "Array Inversion", "algo": "Index Mapping", "tags": ["arrays", "math"],
    "concept": "If friend A gave to B, then B received from A. Invert index↔value: ans[arr[i]] = i.",
    "brute": { "tc": "O(n²)", "sc": "O(n)", "code": "for(int i=1;i<=n;i++) { for(int j=1;j<=n;j++) { if(arr[j]==i) print(j); } }" },
    "optimal": { "tc": "O(n)", "sc": "O(n)", "code": "int[] ans=new int[n+1];\nfor(int i=1;i<=n;i++) ans[arr[i]]=i;\n// print ans[1..n]" }
  },
  {
    "id": 112, "num": "CF-266B", "name": "Queue at the School", "cat": "String", "difficulty": "Easy",
    "day": 1, "topic": "Arrays & Two Pointers", "sheets": ["CodeForces"], "pattern": "Simulation", "algo": "In-place Swap", "tags": ["simulation", "string"],
    "concept": "Each second, simultaneously swap every 'BG' pair. Process left-to-right in one pass per second; skip i++ after a swap to avoid double-processing.",
    "brute": { "tc": "O(t×n)", "sc": "O(n)", "code": "// Same as optimal; simulation is the only approach." },
    "optimal": { "tc": "O(t×n)", "sc": "O(n)", "code": "char[] s=str.toCharArray();\nwhile(t-->0){\n  for(int i=0;i<n-1;i++){\n    if(s[i]=='B'&&s[i+1]=='G'){s[i]='G';s[i+1]='B';i++;}\n  }\n}" }
  },
  {
    "id": 113, "num": "CF-381A", "name": "Sereja and Dima", "cat": "1D Array", "difficulty": "Easy",
    "day": 1, "topic": "Arrays & Two Pointers", "sheets": ["Amazon"], "pattern": "Two Pointer", "algo": "Greedy Ends", "tags": ["greedy", "two pointer"],
    "concept": "Greedily pick the larger of two ends. Converge l and r pointers, alternating turns.",
    "brute": { "tc": "O(n)", "sc": "O(1)", "code": "// Greedy is already optimal." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "int l=0,r=n-1,s=0,d=0,turn=0;\nwhile(l<=r){\n  int val=(arr[l]>arr[r])?arr[l++]:arr[r--];\n  if(turn%2==0) s+=val; else d+=val;\n  turn++;\n}" }
  },
  {
    "id": 4, "num": "CF-58A", "name": "Chat room", "cat": "String", "difficulty": "Easy",
    "day": 1, "topic": "Arrays & Two Pointers", "sheets": ["Microsoft", "Amazon"], "pattern": "Subsequence Check", "algo": "Two Pointer", "tags": ["string", "two pointer"],
    "concept": "Check if 'hello' is a subsequence of the input. Keep a pointer j on 'hello'; advance when characters match.",
    "brute": { "tc": "O(n)", "sc": "O(1)", "code": "// Subsequence check is already linear." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "String h=\"hello\"; int j=0;\nfor(int i=0;i<s.length();i++){\n  if(s.charAt(i)==h.charAt(j)) j++;\n  if(j==5) return \"YES\";\n}\nreturn \"NO\";" }
  },
  {
    "id": 115, "num": "CF-118A", "name": "String Task", "cat": "String", "difficulty": "Easy",
    "day": 1, "topic": "Arrays & Two Pointers", "sheets": ["Google", "Amazon"], "pattern": "String Processing", "algo": "Character Filter", "tags": ["string"],
    "concept": "Remove vowels, prepend '.' to each consonant, convert all to lowercase.",
    "brute": { "tc": "O(n)", "sc": "O(n)", "code": "// Manual character check." },
    "optimal": { "tc": "O(n)", "sc": "O(n)", "code": "StringBuilder sb=new StringBuilder();\nString v=\"aoyeui\";\nfor(char c:s.toLowerCase().toCharArray()){\n  if(v.indexOf(c)==-1) sb.append('.').append(c);\n}\nreturn sb.toString();" }
  },
  {
    "id": 116, "num": "CF-489B", "name": "BerSU Ball", "cat": "1D Array", "difficulty": "Medium",
    "day": 1, "topic": "Arrays & Two Pointers", "sheets": ["Amazon"], "pattern": "Two Pointer on Sorted", "algo": "Merge-style Matching", "tags": ["greedy", "sorting"],
    "concept": "Sort both arrays. Use two pointers: match a boy-girl pair if |a[i]-b[j]|<=1, else advance the smaller pointer.",
    "brute": { "tc": "O(n×m)", "sc": "O(1)", "code": "// Nested loops with visited array." },
    "optimal": { "tc": "O(n log n + m log m)", "sc": "O(1)", "code": "Arrays.sort(a); Arrays.sort(b);\nint i=0,j=0,pairs=0;\nwhile(i<n&&j<m){\n  if(Math.abs(a[i]-b[j])<=1){pairs++;i++;j++;}\n  else if(a[i]<b[j]) i++; else j++;\n}\nreturn pairs;" }
  },
  {
    "id": 117, "num": "CF-279B", "name": "Books", "cat": "1D Array", "difficulty": "Medium",
    "day": 2, "topic": "Sliding Window & Hashing", "sheets": ["Amazon", "Google"], "pattern": "Variable Sliding Window", "algo": "Two Pointer Window", "tags": ["sliding window"],
    "concept": "Expand window right; if sum > t, shrink from left. Track maximum window length.",
    "brute": { "tc": "O(n²)", "sc": "O(1)", "code": "// Try every subarray." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "int max=0,sum=0,l=0;\nfor(int r=0;r<n;r++){\n  sum+=arr[r];\n  while(sum>t) sum-=arr[l++];\n  max=Math.max(max,r-l+1);\n}\nreturn max;" }
  },
  {
    "id": 118, "num": "CF-363B", "name": "Fence", "cat": "1D Array", "difficulty": "Medium",
    "day": 2, "topic": "Sliding Window & Hashing", "sheets": ["CodeForces"], "pattern": "Fixed Sliding Window", "algo": "Window Sum", "tags": ["sliding window"],
    "concept": "Fixed window of size K. Slide and find minimum sum window. Track starting index.",
    "brute": { "tc": "O(n×k)", "sc": "O(1)", "code": "// Sum every k consecutive elements." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "int sum=0,minSum=Integer.MAX_VALUE,idx=0;\nfor(int i=0;i<n;i++){\n  sum+=arr[i];\n  if(i>=k) sum-=arr[i-k];\n  if(i>=k-1&&sum<minSum){minSum=sum;idx=i-k+2;}\n}\nreturn idx;" }
  },
  {
    "id": 119, "num": "CF-520A", "name": "Pangram", "cat": "String", "difficulty": "Easy",
    "day": 2, "topic": "Sliding Window & Hashing", "sheets": ["Amazon"], "pattern": "HashSet Frequency", "algo": "Frequency Count", "tags": ["string", "hashing"],
    "concept": "Check if all 26 letters appear. Use a boolean array of size 26 or a HashSet.",
    "brute": { "tc": "O(26×n)", "sc": "O(1)", "code": "// Check for each letter separately." },
    "optimal": { "tc": "O(n)", "sc": "O(26)", "code": "boolean[] seen=new boolean[26];\nfor(char c:s.toLowerCase().toCharArray()) seen[c-'a']=true;\nfor(boolean b:seen) if(!b) return \"NO\";\nreturn \"YES\";" }
  },
  {
    "id": 120, "num": "CF-977C", "name": "Less or Equal", "cat": "1D Array", "difficulty": "Medium",
    "day": 2, "topic": "Sliding Window & Hashing", "sheets": ["Microsoft"], "pattern": "Sorting + Edge Cases", "algo": "Sort and Index", "tags": ["sorting", "math"],
    "concept": "Sort. If k=0, answer is arr[0]-1 if arr[0]>1 else -1. Otherwise check arr[k-1]!=arr[k].",
    "brute": { "tc": "O(n log n)", "sc": "O(1)", "code": "// Must handle k=0 edge case." },
    "optimal": { "tc": "O(n log n)", "sc": "O(1)", "code": "Arrays.sort(a);\nif(k==0) return a[0]>1?1:-1;\nif(k<n&&a[k-1]==a[k]) return -1;\nreturn a[k-1];" }
  },
  {
    "id": 121, "num": "CF-1360B", "name": "Honest Coach", "cat": "1D Array", "difficulty": "Easy",
    "day": 2, "topic": "Sliding Window & Hashing", "sheets": ["CodeForces"], "pattern": "Sorting", "algo": "Adjacent Diff", "tags": ["sorting"],
    "concept": "Sort. Min difference in final 2 players = min of adjacent differences in sorted array.",
    "brute": { "tc": "O(n²)", "sc": "O(1)", "code": "// Compare all pairs." },
    "optimal": { "tc": "O(n log n)", "sc": "O(1)", "code": "Arrays.sort(a);\nint min=Integer.MAX_VALUE;\nfor(int i=1;i<n;i++) min=Math.min(min,a[i]-a[i-1]);\nreturn min;" }
  },
  {
    "id": 122, "num": "CF-1399A", "name": "Remove Smallest", "cat": "1D Array", "difficulty": "Easy",
    "day": 2, "topic": "Sliding Window & Hashing", "sheets": ["CodeForces"], "pattern": "Sorting + Greedy", "algo": "Adjacent Check", "tags": ["sorting", "greedy"],
    "concept": "Sort. If any two adjacent elements differ by more than 1, answer is NO.",
    "brute": { "tc": "O(n log n)", "sc": "O(1)", "code": "// Sorting forces optimal comparison order." },
    "optimal": { "tc": "O(n log n)", "sc": "O(1)", "code": "Arrays.sort(a);\nfor(int i=1;i<n;i++){\n  if(a[i]-a[i-1]>1) return \"NO\";\n}\nreturn \"YES\";" }
  },
  {
    "id": 123, "num": "CF-433B", "name": "Kuriyama Mirai's Stones", "cat": "1D Array", "difficulty": "Medium",
    "day": 3, "topic": "Prefix Sums & Math", "sheets": ["Microsoft"], "pattern": "Prefix Sum Dual", "algo": "Sorting + Prefix", "tags": ["prefix sum", "sorting"],
    "concept": "Build prefix sum on original array and on sorted array. Answer queries in O(1) using range formula.",
    "brute": { "tc": "O(q×n)", "sc": "O(1)", "code": "// Iterate l to r for each query." },
    "optimal": { "tc": "O(n log n + q)", "sc": "O(n)", "code": "long[] pre1=new long[n+1],pre2=new long[n+1];\nfor(int i=0;i<n;i++) pre1[i+1]=pre1[i]+a[i];\nArrays.sort(a);\nfor(int i=0;i<n;i++) pre2[i+1]=pre2[i]+a[i];\n// query: pre[r]-pre[l-1]" }
  },
  {
    "id": 124, "num": "CF-313B", "name": "Ilya and Queries", "cat": "String", "difficulty": "Medium",
    "day": 3, "topic": "Prefix Sums & Math", "sheets": ["Amazon"], "pattern": "Prefix Sum on String", "algo": "Character Match Prefix", "tags": ["prefix sum", "string"],
    "concept": "dp[i] = dp[i-1] + (s[i]==s[i-1]?1:0). Query [l,r] answer = dp[r-1]-dp[l-1].",
    "brute": { "tc": "O(q×n)", "sc": "O(1)", "code": "// Iterate l to r for each query." },
    "optimal": { "tc": "O(n + q)", "sc": "O(n)", "code": "int[] dp=new int[n];\nfor(int i=1;i<n;i++) dp[i]=dp[i-1]+(s.charAt(i)==s.charAt(i-1)?1:0);\n// query l,r: dp[r-1]-dp[l-1]" }
  },
  {
    "id": 125, "num": "CF-165C", "name": "Another Problem on Strings", "cat": "String", "difficulty": "Hard",
    "day": 3, "topic": "Prefix Sums & Math", "sheets": ["Amazon"], "pattern": "Prefix Sum + HashMap", "algo": "Subarray Sum = K", "tags": ["prefix sum", "hashmap"],
    "concept": "Count substrings with exactly K ones. Classic prefix sum + HashMap: count pairs where pre[j]-pre[i]=K.",
    "brute": { "tc": "O(n²)", "sc": "O(1)", "code": "// Check all subarrays." },
    "optimal": { "tc": "O(n)", "sc": "O(n)", "code": "Map<Integer,Integer> map=new HashMap<>();\nmap.put(0,1); int pre=0; long ans=0;\nfor(char c:s.toCharArray()){\n  pre+=(c-'0');\n  ans+=map.getOrDefault(pre-k,0);\n  map.put(pre,map.getOrDefault(pre,0)+1);\n}\nreturn ans;" }
  },
  {
    "id": 126, "num": "CF-466C", "name": "Number of Ways", "cat": "1D Array", "difficulty": "Hard",
    "day": 3, "topic": "Prefix Sums & Math", "sheets": ["Google"], "pattern": "3-Part Split", "algo": "Prefix Count", "tags": ["prefix sum"],
    "concept": "Split array into 3 equal sum parts. Total must be divisible by 3. Count valid j positions after all valid i positions.",
    "brute": { "tc": "O(n²)", "sc": "O(1)", "code": "// Try all split point pairs i and j." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "if(total%3!=0) return 0;\nlong target=total/3,sum=0,ways=0,count=0;\nfor(int i=0;i<n-1;i++){\n  sum+=a[i];\n  if(sum==target*2) ways+=count;\n  if(sum==target) count++;\n}\nreturn ways;" }
  },
  {
    "id": 127, "num": "CF-1520D", "name": "Same Differences", "cat": "1D Array", "difficulty": "Medium",
    "day": 3, "topic": "Prefix Sums & Math", "sheets": ["Amazon"], "pattern": "HashMap Counting", "algo": "Index Transformation", "tags": ["hashmap", "math"],
    "concept": "Count pairs where a[j]-a[i]=j-i → a[j]-j=a[i]-i. Group by (a[i]-i) and count pairs within each group.",
    "brute": { "tc": "O(n²)", "sc": "O(1)", "code": "// Check all i,j pairs." },
    "optimal": { "tc": "O(n)", "sc": "O(n)", "code": "Map<Integer,Long> map=new HashMap<>();\nlong count=0;\nfor(int i=0;i<n;i++){\n  int val=a[i]-i;\n  count+=map.getOrDefault(val,0L);\n  map.put(val,map.getOrDefault(val,0L)+1);\n}\nreturn count;" }
  },
  {
    "id": 128, "num": "CF-1352C", "name": "K-th Not Divisible by n", "cat": "Math", "difficulty": "Medium",
    "day": 3, "topic": "Prefix Sums & Math", "sheets": ["Microsoft"], "pattern": "Pure Math", "algo": "Formula Derivation", "tags": ["math"],
    "concept": "In every block of n integers, n-1 are not divisible. Formula: answer = k + (k-1)/(n-1).",
    "brute": { "tc": "O(k)", "sc": "O(1)", "code": "// Iterate and skip multiples of n." },
    "optimal": { "tc": "O(1)", "sc": "O(1)", "code": "return k+(k-1)/(n-1); // Pure math formula" }
  },
  {
    "id": 129, "num": "CF-474B", "name": "Worms", "cat": "1D Array", "difficulty": "Medium",
    "day": 4, "topic": "Binary Search & Greedy", "sheets": ["Amazon"], "pattern": "Binary Search on Prefix", "algo": "Lower Bound", "tags": ["binary search", "prefix sum"],
    "concept": "Build prefix sums of pile sizes. For query w, binary search (lower_bound) for first pile whose prefix >= w.",
    "brute": { "tc": "O(q×n)", "sc": "O(n)", "code": "// Linear scan for every query." },
    "optimal": { "tc": "O(q log n)", "sc": "O(n)", "code": "int[] pre=new int[n]; pre[0]=a[0];\nfor(int i=1;i<n;i++) pre[i]=pre[i-1]+a[i];\n// for query q:\nint lo=0,hi=n-1;\nwhile(lo<hi){\n  int mid=lo+(hi-lo)/2;\n  if(pre[mid]>=q) hi=mid; else lo=mid+1;\n}\nreturn lo+1;" }
  },
  {
    "id": 130, "num": "CF-670D1", "name": "Magic Powder", "cat": "1D Array", "difficulty": "Medium",
    "day": 4, "topic": "Binary Search & Greedy", "sheets": ["Google"], "pattern": "Binary Search on Answer", "algo": "Feasibility Check", "tags": ["binary search"],
    "concept": "Binary search on number of cookies. For mid cookies, compute required extra powder; check if ≤ k.",
    "brute": { "tc": "O(ans×n)", "sc": "O(1)", "code": "// Cookie by cookie simulation." },
    "optimal": { "tc": "O(n log MAX)", "sc": "O(1)", "code": "long lo=0,hi=2000000000L;\nwhile(lo<hi){\n  long mid=lo+(hi-lo+1)/2,need=0;\n  for(int i=0;i<n;i++){\n    if(a[i]*mid>b[i]) need+=(a[i]*mid-b[i]);\n    if(need>k) break;\n  }\n  if(need<=k) lo=mid; else hi=mid-1;\n}\nreturn lo;" }
  },
  {
    "id": 131, "num": "CF-706B", "name": "Interesting Drink", "cat": "1D Array", "difficulty": "Medium",
    "day": 4, "topic": "Binary Search & Greedy", "sheets": ["Amazon"], "pattern": "Upper Bound Binary Search", "algo": "Count ≤ Budget", "tags": ["binary search", "sorting"],
    "concept": "Sort prices. For each query (budget), count affordable shops using upper_bound binary search.",
    "brute": { "tc": "O(q×n)", "sc": "O(1)", "code": "// Linear count for each query." },
    "optimal": { "tc": "O(n log n + q log n)", "sc": "O(1)", "code": "Arrays.sort(a);\n// per query q: upper_bound\nint lo=0,hi=n;\nwhile(lo<hi){\n  int mid=lo+(hi-lo)/2;\n  if(a[mid]<=q) lo=mid+1; else hi=mid;\n}\nreturn lo;" }
  },
  {
    "id": 22, "num": "CF-978C", "name": "Letters", "cat": "1D Array", "difficulty": "Medium",
    "day": 4, "topic": "Binary Search & Greedy", "sheets": ["CodeForces"], "pattern": "Two Pointer on Prefix", "algo": "Cumulative Pointer", "tags": ["two pointer", "prefix sum"],
    "concept": "Since queries arrive sorted, use a pointer that advances through dorm boundaries. O(n+q) beats binary search per query.",
    "brute": { "tc": "O(q×n)", "sc": "O(1)", "code": "// Recalculate dorm for every letter." },
    "optimal": { "tc": "O(n + q)", "sc": "O(n)", "code": "long pre=0; int dorm=0;\nfor(long letter:queries){\n  while(pre+a[dorm]<letter) pre+=a[dorm++];\n  System.out.println((dorm+1)+\" \"+(letter-pre));\n}" }
  },
  {
    "id": 23, "num": "CF-230A", "name": "Dragons", "cat": "2D Array", "difficulty": "Medium",
    "day": 4, "topic": "Binary Search & Greedy", "sheets": ["Google"], "pattern": "Greedy Ordering", "algo": "Sort by Strength", "tags": ["greedy", "sorting"],
    "concept": "Sort by strength ascending. Defeat weakest first to maximize bonus accumulation. Greedy exchange argument proves optimality.",
    "brute": { "tc": "O(n!)", "sc": "O(n)", "code": "// All permutations." },
    "optimal": { "tc": "O(n log n)", "sc": "O(1)", "code": "Arrays.sort(arr,(a,b)->Integer.compare(a[0],b[0]));\nfor(int[] d:arr){\n  if(s>d[0]) s+=d[1];\n  else return \"NO\";\n}\nreturn \"YES\";" }
  },
  {
    "id": 24, "num": "CF-158B", "name": "Taxi", "cat": "1D Array", "difficulty": "Medium",
    "day": 4, "topic": "Binary Search & Greedy", "sheets": ["CodeForces"], "pattern": "Greedy Bin Packing", "algo": "Group Math", "tags": ["greedy", "math"],
    "concept": "4s go alone, 3s pair with 1s, 2s pair with 2s, remaining 1s fill 4s. Greedy count formula.",
    "brute": { "tc": "O(n)", "sc": "O(1)", "code": "// Greedy math is already optimal." },
    "optimal": { "tc": "O(n)", "sc": "O(5)", "code": "int[] c=new int[5];\nfor(int x:a) c[x]++;\nint taxis=c[4]+c[3]+c[2]/2;\nc[1]-=Math.min(c[1],c[3]);\nif(c[2]%2==1){taxis++;c[1]-=Math.min(c[1],2);}\nif(c[1]>0) taxis+=(c[1]+3)/4;\nreturn taxis;" }
  },
  {
    "id": 25, "num": "CF-455A", "name": "Boredom", "cat": "1D Array", "difficulty": "Hard",
    "day": 5, "topic": "Dynamic Programming", "sheets": ["Amazon"], "pattern": "House Robber DP", "algo": "Frequency DP", "tags": ["dp", "house robber"],
    "concept": "Picking X earns X×freq[X] but forbids X±1. Maps to House Robber on frequency array: dp[i]=max(dp[i-1], dp[i-2]+i×freq[i]).",
    "brute": { "tc": "O(2^n)", "sc": "O(n)", "code": "// Exponential subset selection." },
    "optimal": { "tc": "O(n + max_val)", "sc": "O(max_val)", "code": "long[] dp=new long[100005];\ndp[1]=freq[1];\nfor(int i=2;i<=100000;i++){\n  dp[i]=Math.max(dp[i-1],dp[i-2]+i*(long)freq[i]);\n}\nreturn dp[100000];" }
  },
  {
    "id": 26, "num": "CF-189A", "name": "Cut Ribbon", "cat": "1D Array", "difficulty": "Medium",
    "day": 5, "topic": "Dynamic Programming", "sheets": ["Microsoft"], "pattern": "Unbounded Knapsack", "algo": "1D DP", "tags": ["dp", "knapsack"],
    "concept": "Maximize ribbon cuts using lengths a,b,c. dp[i]=max cuts for ribbon of length i. Initialize dp[i]=-INF except dp[0]=0.",
    "brute": { "tc": "O(3^n)", "sc": "O(n)", "code": "// 3-branch recursion." },
    "optimal": { "tc": "O(n)", "sc": "O(n)", "code": "int[] dp=new int[n+1]; Arrays.fill(dp,-10000); dp[0]=0;\nfor(int i=1;i<=n;i++){\n  if(i>=a) dp[i]=Math.max(dp[i],dp[i-a]+1);\n  if(i>=b) dp[i]=Math.max(dp[i],dp[i-b]+1);\n  if(i>=c) dp[i]=Math.max(dp[i],dp[i-c]+1);\n}\nreturn dp[n];" }
  },
  {
    "id": 27, "num": "CF-702A", "name": "Maximum Increase", "cat": "1D Array", "difficulty": "Easy",
    "day": 5, "topic": "Dynamic Programming", "sheets": ["Amazon"], "pattern": "Subarray DP", "algo": "LIS Contiguous", "tags": ["dp"],
    "concept": "Longest strictly increasing CONTIGUOUS subarray. dp[i] = a[i]>a[i-1] ? dp[i-1]+1 : 1.",
    "brute": { "tc": "O(n²)", "sc": "O(1)", "code": "// Check all subarrays." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "int max=1,curr=1;\nfor(int i=1;i<n;i++){\n  if(a[i]>a[i-1]) curr++; else curr=1;\n  max=Math.max(max,curr);\n}\nreturn max;" }
  },
  {
    "id": 28, "num": "CF-327A", "name": "Flipping Game", "cat": "1D Array", "difficulty": "Medium",
    "day": 5, "topic": "Dynamic Programming", "sheets": ["Google"], "pattern": "Kadane's Algorithm", "algo": "Max Subarray Gain", "tags": ["dp", "kadane"],
    "concept": "Flip turns 0→+1 and 1→-1. Apply Kadane's to find the flip subarray maximizing net gain. Handle all-1s edge case.",
    "brute": { "tc": "O(n²)", "sc": "O(1)", "code": "// Try flipping every subarray." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "int ones=0,maxGain=-1,curr=0;\nfor(int x:a){\n  if(x==1){ones++;curr--;} else curr++;\n  if(curr<0) curr=0;\n  maxGain=Math.max(maxGain,curr);\n}\nreturn maxGain==-1?ones-1:ones+maxGain;" }
  },
  {
    "id": 29, "num": "CF-545C", "name": "Woodcutters", "cat": "1D Array", "difficulty": "Medium",
    "day": 5, "topic": "Dynamic Programming", "sheets": ["Amazon"], "pattern": "Greedy DP", "algo": "Left/Right Fall", "tags": ["greedy", "dp"],
    "concept": "Try falling left if x[i]-h[i]>x[i-1], else fall right if x[i]+h[i]<x[i+1]. Update virtual position if falling right. Ends always free.",
    "brute": { "tc": "O(2^n)", "sc": "O(n)", "code": "// Try all left/right/no fall combos." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "if(n==1) return 1;\nint count=2;\nfor(int i=1;i<n-1;i++){\n  if(x[i]-h[i]>x[i-1]) count++;\n  else if(x[i]+h[i]<x[i+1]){count++;x[i]+=h[i];}\n}\nreturn count;" }
  },
  {
    "id": 30, "num": "CF-492B", "name": "Vanya and Lanterns", "cat": "1D Array", "difficulty": "Medium",
    "day": 5, "topic": "Dynamic Programming", "sheets": ["Amazon"], "pattern": "Sorting + Math", "algo": "Max Gap", "tags": ["sorting", "math"],
    "concept": "Sort. Radius = max of: (a[0]-0), (L-a[n-1]), max(a[i]-a[i-1])/2 for adjacent pairs.",
    "brute": { "tc": "O(n log n)", "sc": "O(1)", "code": "// Sorting is the only approach." },
    "optimal": { "tc": "O(n log n)", "sc": "O(1)", "code": "Arrays.sort(a);\ndouble maxDist=Math.max(a[0],l-a[n-1]);\nfor(int i=1;i<n;i++) maxDist=Math.max(maxDist,(a[i]-a[i-1])/2.0);\nreturn maxDist;" }
  },
  {
    "id": 31, "num": "CF-814A", "name": "An Arithmetic Progression", "cat": "Math", "difficulty": "Easy",
    "day": 6, "topic": "Sorting & Searching", "sheets": ["Amazon"], "pattern": "Sorting + AP check", "algo": "Sort and Verify", "tags": ["sorting", "math"],
    "concept": "Sort array. AP difference = (max-min)/(n-1). Exactly one element missing: find and add it.",
    "brute": { "tc": "O(n log n)", "sc": "O(1)", "code": "// Sort then check each gap." },
    "optimal": { "tc": "O(n log n)", "sc": "O(1)", "code": "Arrays.sort(a);\nint d=(a[n-1]-a[0])/(n-1);\nfor(int i=1;i<n;i++){\n  if(a[i]-a[i-1]==2*d) return a[i]-d;\n}\nreturn -1; // or a[0]-d or a[n-1]+d" }
  },
  {
    "id": 32, "num": "CF-732A", "name": "Buy a Shovel", "cat": "Math", "difficulty": "Easy",
    "day": 6, "topic": "Sorting & Searching", "sheets": ["CodeForces"], "pattern": "Math/Divisibility", "algo": "Greedy Coin", "tags": ["math", "greedy"],
    "concept": "Find minimum k where k×cost leaves no change (cost×k mod coins = 0, coins=1,5,10). Check coins=10 first.",
    "brute": { "tc": "O(n)", "sc": "O(1)", "code": "// Iterate k from 1 to n." },
    "optimal": { "tc": "O(1)", "sc": "O(1)", "code": "// price ends in 0: k=1\n// price ends in 5: k=2\n// otherwise: k=10/(gcd(10,price%10))" }
  },
  {
    "id": 33, "num": "CF-1015C", "name": "Songs Compression", "cat": "1D Array", "difficulty": "Medium",
    "day": 6, "topic": "Sorting & Searching", "sheets": ["Amazon"], "pattern": "Greedy Compression", "algo": "Sort by Gain", "tags": ["greedy", "sorting"],
    "concept": "Each song can be compressed by (a[i]-b[i]). Sort by compression gain descending. Greedily compress until fits.",
    "brute": { "tc": "O(n!)", "sc": "O(1)", "code": "// Try all compression orders." },
    "optimal": { "tc": "O(n log n)", "sc": "O(n)", "code": "int[] gain=new int[n];\nfor(int i=0;i<n;i++) gain[i]=a[i]-b[i];\nArrays.sort(gain);\n// Apply largest gains first until sum<=m" }
  },
  {
    "id": 34, "num": "CF-831A", "name": "Unimodal Array", "cat": "1D Array", "difficulty": "Easy",
    "day": 6, "topic": "Sorting & Searching", "sheets": ["Amazon"], "pattern": "State Machine", "algo": "Phase Tracking", "tags": ["arrays"],
    "concept": "Check 3 phases: non-decreasing → strictly up → non-increasing. State machine: phase can only go 0→1→2, never backwards.",
    "brute": { "tc": "O(n)", "sc": "O(1)", "code": "// Brute same as optimal." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "int phase=0;\nfor(int i=1;i<n;i++){\n  if(a[i]>a[i-1]&&phase==2) return \"NO\";\n  if(a[i]<a[i-1]&&phase==0) return \"NO\";\n  if(a[i]==a[i-1]&&phase==1) phase=2;\n  if(a[i]>a[i-1]) phase=1;\n  if(a[i]<a[i-1]) phase=2;\n}\nreturn \"YES\";" }
  },
  {
    "id": 35, "num": "CF-621B", "name": "Wet Shark and Bishops", "cat": "Math", "difficulty": "Medium",
    "day": 6, "topic": "Sorting & Searching", "sheets": ["Amazon"], "pattern": "Diagonal Hashing", "algo": "HashMap on Diagonals", "tags": ["math", "hashmap"],
    "concept": "Bishops attack on same diagonal. Group by (r-c) for '/' diagonals and (r+c) for '\\' diagonals. Count pairs within each group: C(k,2).",
    "brute": { "tc": "O(n²)", "sc": "O(1)", "code": "// Compare all pairs." },
    "optimal": { "tc": "O(n)", "sc": "O(n)", "code": "Map<Long,Long> d1=new HashMap<>(),d2=new HashMap<>();\nfor(int[] b:bishops){\n  d1.merge((long)b[0]-b[1],1L,Long::sum);\n  d2.merge((long)b[0]+b[1],1L,Long::sum);\n}\nlong ans=0;\nfor(long v:d1.values()) ans+=v*(v-1)/2;\nfor(long v:d2.values()) ans+=v*(v-1)/2;" }
  },
  {
    "id": 36, "num": "CF-580A", "name": "Kefa and First Steps", "cat": "1D Array", "difficulty": "Easy",
    "day": 7, "topic": "Strings & Characters", "sheets": ["CodeForces"], "pattern": "Sliding Window", "algo": "Fixed Condition Window", "tags": ["sliding window", "arrays"],
    "concept": "Longest subarray with at most K distinct salary values. Variable window: shrink when distinct count > K.",
    "brute": { "tc": "O(n²)", "sc": "O(1)", "code": "// All subarrays." },
    "optimal": { "tc": "O(n)", "sc": "O(K)", "code": "Map<Integer,Integer> freq=new HashMap<>();\nint l=0,max=0;\nfor(int r=0;r<n;r++){\n  freq.merge(a[r],1,Integer::sum);\n  while(freq.size()>k) {\n    int v=a[l++];\n    freq.merge(v,-1,Integer::sum);\n    if(freq.get(v)==0) freq.remove(v);\n  }\n  max=Math.max(max,r-l+1);\n}" }
  },
  {
    "id": 37, "num": "CF-59A", "name": "Word", "cat": "String", "difficulty": "Easy",
    "day": 7, "topic": "Strings & Characters", "sheets": ["Amazon"], "pattern": "String Frequency", "algo": "Count and Compare", "tags": ["string"],
    "concept": "Count upper and lower case letters. If more uppercase: convert all to upper; else all to lower. Tie → lowercase.",
    "brute": { "tc": "O(n)", "sc": "O(1)", "code": "// Single pass count." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "int up=0,lo=0;\nfor(char c:s.toCharArray()){\n  if(Character.isUpperCase(c)) up++; else lo++;\n}\nreturn up>lo?s.toUpperCase():s.toLowerCase();" }
  },
  {
    "id": 38, "num": "CF-339B", "name": "Xenia and Tree", "cat": "String", "difficulty": "Easy",
    "day": 7, "topic": "Strings & Characters", "sheets": ["Amazon"], "pattern": "String Comparison", "algo": "Greedy Match", "tags": ["string", "greedy"],
    "concept": "Check if string b can be made from string a by deleting characters (subsequence). Classic two-pointer subsequence check.",
    "brute": { "tc": "O(n×m)", "sc": "O(1)", "code": "// Try all orderings." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "int j=0;\nfor(int i=0;i<a.length()&&j<b.length();i++){\n  if(a.charAt(i)==b.charAt(j)) j++;\n}\nreturn j==b.length();" }
  },
  {
    "id": 39, "num": "CF-828B", "name": "Black Square", "cat": "Math", "difficulty": "Easy",
    "day": 7, "topic": "Strings & Characters", "sheets": ["Amazon"], "pattern": "Math Formula", "algo": "Direct Calculation", "tags": ["math"],
    "concept": "Black cells needed = n - (total white cells already present). Direct arithmetic.",
    "brute": { "tc": "O(1)", "sc": "O(1)", "code": "// Single formula." },
    "optimal": { "tc": "O(1)", "sc": "O(1)", "code": "// answer = n*n - (n * 1 white per row used)\n// Read constraints carefully for exact formula" }
  },
  {
    "id": 40, "num": "CF-1433C", "name": "Dominant Piranha", "cat": "1D Array", "difficulty": "Easy",
    "day": 7, "topic": "Strings & Characters", "sheets": ["CodeForces"], "pattern": "Greedy Max", "algo": "Find Max Adjacent", "tags": ["greedy", "arrays"],
    "concept": "Piranha with max size wins. Among max-sized piranhas, pick one that has a smaller neighbor (it can eat first). That index wins.",
    "brute": { "tc": "O(n)", "sc": "O(1)", "code": "// Find max, check adjacency." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "int max=Arrays.stream(a).max().getAsInt();\nfor(int i=0;i<n;i++){\n  if(a[i]==max){\n    if((i>0&&a[i-1]<max)||(i<n-1&&a[i+1]<max)) return i+1;\n  }\n}" }
  },
  {
    "id": 41, "num": "CF-734B", "name": "Sleepy Game", "cat": "Graph", "difficulty": "Medium",
    "day": 8, "topic": "Graph & BFS/DFS", "sheets": ["Amazon"], "pattern": "BFS Shortest Path", "algo": "BFS on Grid", "tags": ["bfs", "graph"],
    "concept": "Find shortest path in unweighted graph/grid using BFS. Level-by-level traversal guarantees minimum steps.",
    "brute": { "tc": "O(V²)", "sc": "O(V)", "code": "// DFS with path tracking." },
    "optimal": { "tc": "O(V+E)", "sc": "O(V)", "code": "Queue<int[]> q=new LinkedList<>();\nq.add(new int[]{src,0});\nboolean[] vis=new boolean[n];\nwhile(!q.isEmpty()){\n  int[] cur=q.poll();\n  for(int nb:adj[cur[0]]){\n    if(!vis[nb]){vis[nb]=true;q.add(new int[]{nb,cur[1]+1});}\n  }\n}" }
  },
  {
    "id": 42, "num": "CF-580C", "name": "Kefa and Park", "cat": "Graph", "difficulty": "Medium",
    "day": 8, "topic": "Graph & BFS/DFS", "sheets": ["Amazon"], "pattern": "DFS Tree Walk", "algo": "DFS with State", "tags": ["dfs", "graph", "tree"],
    "concept": "BFS/DFS from root. Track current chain of cats. If chain > m, prune that subtree. Count leaf nodes reached.",
    "brute": { "tc": "O(n)", "sc": "O(n)", "code": "// Same — DFS is required." },
    "optimal": { "tc": "O(n)", "sc": "O(n)", "code": "void dfs(int v,int par,int cats){\n  cats=c[v]==1?cats+1:0;\n  if(cats>m) return;\n  boolean isLeaf=true;\n  for(int u:adj[v]){\n    if(u!=par){isLeaf=false;dfs(u,v,cats);}\n  }\n  if(isLeaf) ans++;\n}" }
  },
  {
    "id": 43, "num": "CF-242C", "name": "King's Path", "cat": "Graph", "difficulty": "Medium",
    "day": 8, "topic": "Graph & BFS/DFS", "sheets": ["Amazon"], "pattern": "BFS on Implicit Graph", "algo": "BFS with HashMap", "tags": ["bfs", "hashmap"],
    "concept": "King moves on infinite grid but only to allowed cells. BFS on allowed cells only, stored in a HashSet for O(1) lookup.",
    "brute": { "tc": "O(V+E)", "sc": "O(V)", "code": "// DFS, but BFS preferred for shortest path." },
    "optimal": { "tc": "O(V+E)", "sc": "O(V)", "code": "Set<String> allowed=new HashSet<>();\n// BFS with 8-direction king moves\n// Only enqueue cells in allowed set\n// Use dist HashMap for visited+distance" }
  },
  {
    "id": 44, "num": "CF-277A", "name": "Learning Languages", "cat": "Graph", "difficulty": "Easy",
    "day": 8, "topic": "Graph & BFS/DFS", "sheets": ["Amazon"], "pattern": "Union-Find (DSU)", "algo": "Connected Components", "tags": ["dsu", "graph"],
    "concept": "People sharing a language are connected. Count connected components among people using DSU. Answer = components - 1 (or 1 if no languages known).",
    "brute": { "tc": "O(n²)", "sc": "O(n)", "code": "// Adjacency matrix BFS." },
    "optimal": { "tc": "O(n×m×α(n))", "sc": "O(n)", "code": "// DSU union people who share a language\n// via language nodes as intermediate\nint components=countComponents()-1;\nreturn components;" }
  },
  {
    "id": 45, "num": "CF-1547B", "name": "Alphabetical Strings", "cat": "String", "difficulty": "Medium",
    "day": 9, "topic": "Stack & Monotonic", "sheets": ["Amazon"], "pattern": "Two Pointer from Ends", "algo": "Deque/Two-End Check", "tags": ["string", "two pointer"],
    "concept": "Valid if we can build string by alternately taking from left and right ends such that character values are 1,2,...,n.",
    "brute": { "tc": "O(n!)", "sc": "O(n)", "code": "// All permutations." },
    "optimal": { "tc": "O(n)", "sc": "O(n)", "code": "int l=0,r=n-1,cur=n;\nwhile(l<=r){\n  if(s.charAt(r)-'a'+1==cur){r--;cur--;}\n  else if(s.charAt(l)-'a'+1==cur){l++;cur--;}\n  else return \"No\";\n}\nreturn \"Yes\";" }
  },
  {
    "id": 46, "num": "CF-500B", "name": "New Year Permutation", "cat": "Math", "difficulty": "Medium",
    "day": 9, "topic": "Stack & Monotonic", "sheets": ["Amazon"], "pattern": "Combinatorics", "algo": "DP + Factorial", "tags": ["math", "dp"],
    "concept": "Swappable elements form groups. Within each group, count valid sorted arrangements. Use DP for group sizes.",
    "brute": { "tc": "O(n!)", "sc": "O(1)", "code": "// All permutations." },
    "optimal": { "tc": "O(n log n)", "sc": "O(n)", "code": "// Find connected swap groups\n// For each group of size k: ways=2^(k/2)\n// Multiply all group ways" }
  },
  {
    "id": 47, "num": "CF-1551B", "name": "Wonderful Coloring", "cat": "String", "difficulty": "Easy",
    "day": 9, "topic": "Stack & Monotonic", "sheets": ["CodeForces"], "pattern": "Sorting + Greedy Pairing", "algo": "Sort and Match", "tags": ["greedy", "sorting"],
    "concept": "Sort pairs of (value, index). Greedily assign color 1 to first half and color 2 to second half of each pair. Odd-occurring elements are uncolored.",
    "brute": { "tc": "O(n log n)", "sc": "O(n)", "code": "// Sort and pair." },
    "optimal": { "tc": "O(n log n)", "sc": "O(n)", "code": "// Sort by (value,index)\n// Pair consecutive equal values\n// Assign colors ensuring index order" }
  },
  {
    "id": 48, "num": "CF-1475C", "name": "Strange Beauty", "cat": "1D Array", "difficulty": "Medium",
    "day": 9, "topic": "Stack & Monotonic", "sheets": ["Amazon"], "pattern": "LIS Variant", "algo": "DP on Divisibility", "tags": ["dp", "math"],
    "concept": "Find longest subsequence where every consecutive pair a[i] divides a[i+1]. dp[v] = longest sequence ending at value v.",
    "brute": { "tc": "O(n²)", "sc": "O(n)", "code": "// Check all pairs." },
    "optimal": { "tc": "O(n√MAX)", "sc": "O(MAX)", "code": "int[] dp=new int[MAX+1];\nfor(int x:a){\n  dp[x]=1;\n  for(int d=1;d*d<=x;d++){\n    if(x%d==0){\n      dp[x]=Math.max(dp[x],dp[d]+1);\n      if(d!=x/d) dp[x]=Math.max(dp[x],dp[x/d]+1);\n    }\n  }\n}\nreturn Arrays.stream(dp).max().getAsInt();" }
  },
  {
    "id": 49, "num": "CF-1543B", "name": "Customising the Track", "cat": "Math", "difficulty": "Medium",
    "day": 10, "topic": "Advanced Patterns", "sheets": ["Amazon"], "pattern": "Math + Greedy", "algo": "Equal Distribution", "tags": ["math", "greedy"],
    "concept": "Count total operations to make all elements equal. If total sum divisible by n, answer = sum/n applied cleverly. Count elements above and below target.",
    "brute": { "tc": "O(n²)", "sc": "O(1)", "code": "// Simulate operations." },
    "optimal": { "tc": "O(n)", "sc": "O(1)", "code": "long sum=0;\nfor(int x:a) sum+=x;\nif(sum%n!=0) return -1;\nlong target=sum/n,ops=0;\nfor(int x:a) if(x>target) ops+=(x-target);\nreturn ops;" }
  },
  {
    "id": 50, "num": "CF-1201C", "name": "Maximum Median", "cat": "1D Array", "difficulty": "Hard",
    "day": 10, "topic": "Advanced Patterns", "sheets": ["Amazon", "Google"], "pattern": "Binary Search on Answer", "algo": "Greedy Feasibility", "tags": ["binary search", "greedy"],
    "concept": "Binary search on median value m. Check feasibility: count elements >=m; if we need to increment, greedily add to smallest elements >=m-1.",
    "brute": { "tc": "O(n×MAX)", "sc": "O(1)", "code": "// Try all median values." },
    "optimal": { "tc": "O(n log n log MAX)", "sc": "O(1)", "code": "Arrays.sort(a);\nint lo=a[n/2],hi=2000000000;\nwhile(lo<hi){\n  int mid=lo+(hi-lo+1)/2;\n  long ops=0;\n  for(int i=n/2;i<n;i++) if(a[i]<mid) ops+=mid-a[i];\n  if(ops<=k) lo=mid; else hi=mid-1;\n}\nreturn lo;" }
  }

]; // END OF QUESTIONS ARRAY





/* ═══════════════════════════════════════════════════════════════════════
   10-DAY PLAN
═══════════════════════════════════════════════════════════════════════ */
const PLAN = [
  {day:1,color:"#00d4aa",title:"Foundations: Arrays, Complexity, Math Tricks",focus:"Non-negotiable base",time:"8 hrs",
   theory:["Big-O, Omega, Theta — every complexity class with examples","Array memory model: contiguous blocks, random access O(1)","Java API: Arrays.sort, copyOfRange, fill, binarySearch, Arrays.equals","XOR properties: a^a=0, a^0=a, commutative+associative","Gauss formula n*(n+1)/2, sum of squares n*(n+1)*(2n+1)/6","Two's complement, negation, bitwise AND/OR/XOR/shift"],
   problems:["Two Sum (#1) — HashMap","Missing Number (#268) — XOR + Math","Single Number (#136) — XOR","Contains Duplicate (#217) — HashSet","Plus One (#66) — Carry","Check Sorted+Rotated (#1752) — Count Drops","Max Consecutive Ones (#485)","Find Disappeared Numbers (#448) — Negation"],
   insight:"When problem says 'find missing/single/duplicate in [1..n]', reach for XOR or Gauss formula before any other approach."},
  {day:2,color:"#6366f1",title:"Two Pointer — Opposite Ends + Same Direction",focus:"Amazon's #1 pattern",time:"8 hrs",
   theory:["Opposite ends: sorted arrays, pair/triplet problems","Same direction: slow+fast for remove duplicates, cycle detection","Dutch National Flag: lo/mid/hi three pointers — single pass","Floyd's Cycle: slow moves 1, fast moves 2. Phase2: both move 1.","Key question: 'Can I use two pointers instead of nested loops?'"],
   problems:["Two Sum II (#167) — Sorted TP","3Sum (#15) — Sort+TP","Container Water (#11) — Greedy TP","Trapping Rain Water (#42) — TP","Remove Duplicates (#26) — Same Direction","Sort Colors (#75) — Dutch National Flag","Find Duplicate (#287) — Floyd's Cycle","Move Zeroes (#283)"],
   insight:"Dutch Flag BUG: when swapping with hi, DO NOT increment mid. The swapped element from hi is UNSEEN — must be re-examined."},
  {day:3,color:"#a855f7",title:"Sliding Window — Fixed & Variable",focus:"Subarray/Substring king",time:"8 hrs",
   theory:["Fixed window: add right element, remove left element (k positions back)","Variable window: expand right, shrink left WHILE condition violated","CRITICAL: sliding window ONLY works with POSITIVE numbers for sum","For subarrays with negatives → use prefix sum + HashMap","Trick: 'exactly K' = atMost(K) - atMost(K-1) for counting","Deque for sliding window maximum — monotonic decreasing"],
   problems:["Min Size Subarray Sum (#209) — Variable","Longest Substr No Repeat (#3) — HashMap","Permutation in String (#567) — Fixed+Freq","Sliding Window Max (#239) — Monotonic Deque","Min Window Substring (#76) — Variable+HashMap","Max Consecutive Ones III (#1004) — Variable","Max Erasure Value (#1695)","Subarray Product <K (LC#713)"],
   insight:"Min Window: 'formed' counts DISTINCT chars meeting required frequency — not total char count. Miss this → wrong answers."},
  {day:4,color:"#f59e0b",title:"Prefix Sum + Difference Array",focus:"Range problems",time:"8 hrs",
   theory:["Prefix sum: pre[i]=sum[0..i-1]. Range sum = pre[r+1]-pre[l] in O(1)","ALWAYS init HashMap with {0:1} — handles subarrays starting at index 0","For negatives/any sign: MUST use prefix+HashMap, NOT sliding window","Prefix XOR: same pattern but XOR instead of sum","Difference array: O(1) range update. diff[l]+=v, diff[r+1]-=v","Reconstruct: prefix sum of diff = actual array"],
   problems:["Subarray Sum=K (#560) — MUST KNOW","Product Except Self (#238) — Prefix×Suffix","Contiguous Array (#525) — Replace 0→-1","Subarray Divisible by K (#974) — Prefix Mod","Subarray XOR=K (GFG)","Find Pivot Index (#724)","Array Manipulation (Difference Array)","Longest Subarray Sum=K (GFG)"],
   insight:"PREFIX SUM TEMPLATE: map.put(0,1); prefix=0; for each num: prefix+=num; cnt+=map.get(prefix-k,0); map.put(prefix,...). Memorize this cold."},
  {day:5,color:"#ef4444",title:"Binary Search — All Templates",focus:"O(log n) mastery",time:"8 hrs",
   theory:["Template 1: Exact match. lo<=hi. Return mid or -1.","Template 2: Lower bound (first TRUE). lo<hi. hi=mid or lo=mid+1.","Template 3: Answer space. lo=min_possible, hi=max_possible. isValid check.","Rotated sorted: ONE HALF is always sorted — identify it.","Rule: ALWAYS use mid=lo+(hi-lo)/2, NEVER (lo+hi)/2 (overflow!)","Binary search on ANSWER: identify monotonic feasibility function"],
   problems:["Binary Search (#704) — Template 1","Search Rotated (#33) — Modified BS","Find Min Rotated (#153) — BS","First+Last Position (#34) — Lower+Upper Bound","Find Peak (#162) — BS","Koko Eating Bananas (#875) — Answer Space","Allocate Pages (CN) — Answer Space","Median Two Sorted (#4) — Hard BS"],
   insight:"BS on Answer: lo=max_element (single group), hi=total_sum (one group). isValid: greedy count of groups. This template solves 30% of Hard problems."},
  {day:6,color:"#10b981",title:"Sorting Algorithms + Intervals + Greedy",focus:"Implementation + proof",time:"8 hrs",
   theory:["QuickSort: random pivot, avg O(n log n), worst O(n²). In-place, unstable.","MergeSort: always O(n log n), O(n) space, stable. Use for inversions.","HeapSort: O(n log n) in-place, unstable. Use heap for K-th problems.","QuickSelect: O(n) avg for Kth. Randomize pivot.","Interval sort: by START for merge, by END for non-overlapping/greedy.","Custom comparator: (a,b)->ab.compareTo(ba) for largest number"],
   problems:["Merge Intervals (#56) — Sort+Merge","Insert Interval (#57) — Three Phase","Non-overlapping Intervals (#435) — Sort by End","Interval Intersections (#986) — Two Pointer","Kth Largest Element (#215) — QuickSelect","Largest Number (#179) — Custom Comp","Meeting Rooms II (Sort+Heap)","Min Arrows to Burst Balloons (#452)"],
   insight:"Sort by END for interval removal/greedy. Sort by START for interval merging. Confusing these gives wrong solutions."},
  {day:7,color:"#f97316",title:"Kadane's + DP on Arrays",focus:"Max/Min problems",time:"8 hrs",
   theory:["Kadane's: curr=max(arr[i], curr+arr[i]). Extend or restart.","Product variant: track BOTH max and min. Save tempMax before update!","Stock state machine: 4 states buy1/sell1/buy2/sell2. sell1 funds buy2.","House Robber: prev2=dp[i-2], prev1=dp[i-1]. O(1) space.","LIS Patience Sorting: binary search on tails array. O(n log n).","Knapsack 0/1: iterate j backwards to prevent element reuse."],
   problems:["Max Subarray (#53) — Kadane","Max Product Subarray (#152) — Track Min","Stock I (#121) — Running Min","Stock III (#123) — State Machine DP","House Robber (#198) — Linear DP","House Robber II (#213) — Two DP Calls","LIS (#300) — Patience Sorting","Partition Equal Subset (#416) — 0/1 Knapsack"],
   insight:"Product subarray: save tempMax BEFORE computing new minP. Classic bug: using updated maxP to compute minP gives wrong answer."},
  {day:8,color:"#ec4899",title:"HashMap + Voting + Cyclic Sort",focus:"O(n) O(1) space tricks",time:"8 hrs",
   theory:["Boyer-Moore: cancellation voting. MUST verify candidate with 2nd pass.","Extended BM for n/3: two candidates, two counts. VERIFY BOTH.","Cyclic sort: nums[i] at index nums[i]-1. Skip if correct or out of range.","Negate-to-mark: use sign bit as visited flag. Works for [1..n] arrays.","Index as hash: use array indices as hash table for O(n) O(1) solutions.","HashSet.contains vs sorted binary search trade-off"],
   problems:["Majority Element (#169) — Boyer-Moore","Majority Element II (#229) — Extended BM+VERIFY","Longest Consecutive (#128) — HashSet","Group Anagrams (#49) — Sort Key","Top K Frequent (#347) — Bucket Sort","First Missing Positive (#41) — Cyclic Sort","Find All Duplicates (#442) — Negation","Missing+Repeating (GFG) — Math"],
   insight:"Boyer-Moore without verification: WRONG if majority not guaranteed. Problem #229 REQUIRES verification — candidates may not meet >n/3 threshold."},
  {day:9,color:"#8b5cf6",title:"Monotonic Stack + 2D Arrays + Matrix",focus:"Advanced patterns",time:"9 hrs",
   theory:["Monotonic decreasing stack for next-greater. O(n) amortized.","Histogram: sentinel 0 forces all remaining to be processed.","Width in histogram: stack.empty?i:i-stack.peek()-1.","Matrix rotation: transpose → reverse rows (90° CW).","Matrix search: treat as 1D if both conditions, else top-right corner.","2D prefix sum: dp[i][j]=dp[i-1][j]+dp[i][j-1]-dp[i-1][j-1]+grid[i-1][j-1]"],
   problems:["Daily Temperatures (#739) — Decreasing Stack","Largest Rectangle Histogram (#84) — Stack","Maximal Rectangle (#85) — Row Histograms","Rotate Image (#48) — Transpose+Reverse","Spiral Matrix (#54) — Boundary","Set Matrix Zeroes (#73) — First Row/Col","Search Matrix I (#74) — Flatten BS","Search Matrix II (#240) — Top-Right","Max Area of Island (#695) — DFS"],
   insight:"Histogram width: when stack is empty after pop, the bar extends all the way to index 0, so width=i. Otherwise width=i-stack.peek()-1."},
  {day:10,color:"#06b6d4",title:"Strings + Divide&Conquer + Mock Interview",focus:"Final preparation",time:"9 hrs",
   theory:["Strings: use char[] for in-place operations. StringBuilder for building.","KMP: LPS array avoids redundant comparisons. O(n+m) guaranteed.","Expand-around-center for palindromes: 2n-1 centers.","Count Inversions = merge sort. Count during merge step.","Difference: count BEFORE merge (reverse pairs) vs DURING merge (inversions).","Interview protocol: clarify → brute O(n²) → optimize to O(n) → code → test"],
   problems:["Count Inversions (GFG) — Modified MergeSort","Reverse Pairs (#493) — Modified MergeSort","Valid Palindrome (#125)","Longest Palindromic Substring (#5)","Group Anagrams (#49)","Word Break (#139) — DP","Edit Distance (#72) — Hard DP","Gas Station (#134) — Greedy","2 Mock problems unseen under 45min timer each"],
   insight:"Interview rule: ALWAYS state brute force first with complexity. Then say 'I can optimize this by...' Amazon interviewers reward systematic thinking over jumping to optimal."},
];

/* ═══════════════════════════════════════════════════════════════════════
   ALGORITHMS REFERENCE
═══════════════════════════════════════════════════════════════════════ */
const ALGOS = [
  {name:"QuickSort + QuickSelect",icon:"⚡",tc:"O(n log n) avg / O(n²) worst",sc:"O(log n)",
   when:"Default in-place sort. QuickSelect for Kth element O(n) avg.",
   code:`// QuickSort with random pivot
void quickSort(int[] a, int lo, int hi) {
    if(lo>=hi)return;
    swap(a,lo+(int)(Math.random()*(hi-lo+1)),hi); // randomize
    int p=partition(a,lo,hi);
    quickSort(a,lo,p-1); quickSort(a,p+1,hi);
}
int partition(int[] a, int lo, int hi){
    int piv=a[hi],i=lo;
    for(int j=lo;j<hi;j++) if(a[j]<=piv) swap(a,i++,j);
    swap(a,i,hi); return i;
}
// QuickSelect — find kth smallest (0-indexed)
int quickSelect(int[] a, int lo, int hi, int k){
    if(lo==hi)return a[lo];
    int p=partition(a,lo,hi);
    if(p==k)return a[p];
    return p>k?quickSelect(a,lo,p-1,k):quickSelect(a,p+1,hi,k);
}`},
  {name:"MergeSort (Count Inversions)",icon:"🔀",tc:"O(n log n) always",sc:"O(n)",
   when:"Stable sort. Count inversions. Sort linked list. External sort.",
   code:`long cnt = 0;
void mergeSort(int[] a, int lo, int hi){
    if(lo>=hi)return; int m=lo+(hi-lo)/2;
    mergeSort(a,lo,m); mergeSort(a,m+1,hi); merge(a,lo,m,hi);
}
void merge(int[] a, int lo, int m, int hi){
    int[] L=Arrays.copyOfRange(a,lo,m+1), R=Arrays.copyOfRange(a,m+1,hi+1);
    int i=0,j=0,k=lo;
    while(i<L.length&&j<R.length){
        if(L[i]<=R[j]) a[k++]=L[i++];
        else{a[k++]=R[j++];cnt+=(L.length-i);} // count inversions
    }
    while(i<L.length)a[k++]=L[i++];
    while(j<R.length)a[k++]=R[j++];
}`},
  {name:"Binary Search (3 Templates)",icon:"🔍",tc:"O(log n)",sc:"O(1)",
   when:"Sorted array. Search space. Monotonic feasibility. Answer-space problems.",
   code:`// T1: Exact match (lo<=hi)
int bs1(int[] a,int t){int lo=0,hi=a.length-1;
    while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]==t)return m;if(a[m]<t)lo=m+1;else hi=m-1;}return -1;}
// T2: Lower bound — first index where a[i]>=t (lo<hi)
int lowerBound(int[] a,int t){int lo=0,hi=a.length;
    while(lo<hi){int m=lo+(hi-lo)/2;if(a[m]<t)lo=m+1;else hi=m;}return lo;}
// T3: Answer space — minimize feasible answer
int ansBS(int lo,int hi,int[] arr,int k){
    while(lo<hi){int m=lo+(hi-lo)/2;
        if(isValid(arr,m,k))hi=m;else lo=m+1;}return lo;}
boolean isValid(int[] arr,int mid,int k){
    int parts=1,sum=0;
    for(int x:arr){if(sum+x>mid){parts++;sum=0;}sum+=x;}return parts<=k;}`},
  {name:"HeapSort + Min/Max Heap",icon:"🏔",tc:"O(n log n)",sc:"O(1)",
   when:"In-place guaranteed O(n log n). K-th largest with min-heap of size k.",
   code:`// Kth largest via min-heap (safer than QuickSelect in interviews)
int kthLargest(int[] nums,int k){
    PriorityQueue<Integer> pq=new PriorityQueue<>();
    for(int n:nums){pq.offer(n);if(pq.size()>k)pq.poll();}
    return pq.peek();
}
// HeapSort in-place
void heapSort(int[] a){
    int n=a.length;
    for(int i=n/2-1;i>=0;i--) heapify(a,n,i);
    for(int i=n-1;i>0;i--){swap(a,0,i);heapify(a,i,0);}
}
void heapify(int[] a,int n,int i){
    int max=i,l=2*i+1,r=2*i+2;
    if(l<n&&a[l]>a[max])max=l;
    if(r<n&&a[r]>a[max])max=r;
    if(max!=i){swap(a,i,max);heapify(a,n,max);}
}`},
  {name:"Dutch National Flag",icon:"🚦",tc:"O(n)",sc:"O(1)",
   when:"Sort 3 categories. 3-way partition. Single pass.",
   code:`void dnf(int[] a){
    int lo=0,mid=0,hi=a.length-1;
    while(mid<=hi){
        if(a[mid]==0) swap(a,lo++,mid++);  // 0: front zone
        else if(a[mid]==1) mid++;           // 1: correct
        else swap(a,mid,hi--);             // 2: back zone (NO mid++)
    }
}
// KEY BUG: when swapping with hi, element from hi is UNSEEN.
// Must NOT increment mid — need to re-examine it.`},
  {name:"Boyer-Moore Voting",icon:"🗳",tc:"O(n)",sc:"O(1)",
   when:"Find majority element >n/2 or >n/3. Must verify if not guaranteed.",
   code:`// Majority > n/2
int majority(int[] nums){
    int cand=nums[0],cnt=1;
    for(int i=1;i<nums.length;i++){
        if(cnt==0)cand=nums[i];
        cnt+=(nums[i]==cand)?1:-1;
    }
    return cand; // VERIFY if not guaranteed to exist
}
// Majority > n/3: two candidates, MUST do verification pass
// Verification: count actual occurrences, check > n/3`},
  {name:"Kadane's (All Variants)",icon:"📈",tc:"O(n)",sc:"O(1)",
   when:"Max/min contiguous subarray sum or product.",
   code:`// Standard max sum
int maxSum(int[] a){
    int max=a[0],cur=a[0];
    for(int i=1;i<a.length;i++){cur=Math.max(a[i],cur+a[i]);max=Math.max(max,cur);}return max;}
// Max PRODUCT — track min too (negatives flip sign)
int maxProd(int[] a){
    int max=a[0],min=a[0],res=a[0];
    for(int i=1;i<a.length;i++){
        int t=max; // SAVE before overwrite
        max=Math.max(a[i],Math.max(max*a[i],min*a[i]));
        min=Math.min(a[i],Math.min(t*a[i],min*a[i]));
        res=Math.max(res,max);}return res;}`},
  {name:"Cyclic Sort",icon:"🔄",tc:"O(n)",sc:"O(1)",
   when:"Array values in [1..n] or [0..n]. Find missing/duplicate in O(n) O(1).",
   code:`void cyclicSort(int[] nums){
    int i=0;
    while(i<nums.length){
        int j=nums[i]-1; // where nums[i] should go
        if(j>=0&&j<nums.length&&nums[j]!=nums[i])
            swap(nums,i,j); // place correctly
        else i++; // already correct OR out of range [1..n] OR duplicate
    }
}
// After: scan for nums[i]!=i+1 (missing) or nums[i]==nums[nums[i]-1] (duplicate)`},
  {name:"Prefix Sum + Difference Array",icon:"➕",tc:"O(n+q)",sc:"O(n)",
   when:"Range sum queries O(1). Range updates O(1). Subarray sum counting.",
   code:`// Prefix sum — O(1) range query after O(n) build
int[] pre=new int[n+1];
for(int i=0;i<n;i++) pre[i+1]=pre[i]+arr[i];
int rangeSum=pre[r+1]-pre[l]; // sum[l..r] inclusive
// Difference array — O(1) range update
int[] diff=new int[n+2];
diff[l]+=val; diff[r+1]-=val; // add val to [l,r]
// Reconstruct: cumulative sum of diff = actual values
// Subarray sum=k: map.put(0,1); prefix=0; cnt+=map.get(prefix-k,0); map.put(prefix,...);`},
  {name:"Monotonic Stack",icon:"📚",tc:"O(n) amortized",sc:"O(n)",
   when:"Next greater/smaller. Histogram area. Trap water.",
   code:`// Next Greater Element (decreasing stack of indices)
int[] nextGreater(int[] arr){
    int n=arr.length; int[] res=new int[n]; Arrays.fill(res,-1);
    Deque<Integer> st=new ArrayDeque<>();
    for(int i=0;i<n;i++){
        while(!st.isEmpty()&&arr[i]>arr[st.peek()])
            res[st.pop()]=arr[i];
        st.push(i);
    }return res;}
// Histogram: push index, pop when smaller bar seen
// Width = st.isEmpty()?i:i-st.peek()-1
// Add sentinel 0 at end to force flush all remaining`},
  {name:"Floyd's Cycle Detection",icon:"🐢",tc:"O(n)",sc:"O(1)",
   when:"Find duplicate in [1..n+1] array. Detect cycle in linked list.",
   code:`// Find duplicate in array [1..n+1]
int findDuplicate(int[] nums){
    // Phase 1: slow=1step, fast=2steps → find intersection
    int slow=nums[0],fast=nums[0];
    do{slow=nums[slow];fast=nums[nums[fast]];}while(slow!=fast);
    // Phase 2: both 1 step, reset slow to START (nums[0])
    slow=nums[0];
    while(slow!=fast){slow=nums[slow];fast=nums[fast];}
    return slow;
}
// CRITICAL: reset slow to nums[0] (the first pointer value), NOT to index 0`},
  {name:"KMP String Matching",icon:"🔤",tc:"O(n+m)",sc:"O(m)",
   when:"Find pattern in text O(n+m). Avoid O(nm) brute force.",
   code:`int[] buildLPS(String pat){
    int m=pat.length(); int[] lps=new int[m];
    for(int i=1,j=0;i<m;){
        if(pat.charAt(i)==pat.charAt(j)) lps[i++]=++j;
        else if(j>0) j=lps[j-1];
        else i++;
    }return lps;}
int kmpSearch(String text,String pat){
    int[] lps=buildLPS(pat);
    for(int i=0,j=0;i<text.length();){
        if(text.charAt(i)==pat.charAt(j)){i++;j++;}
        if(j==pat.length())return i-j; // FOUND
        if(i<text.length()&&text.charAt(i)!=pat.charAt(j))
            j=(j>0)?lps[j-1]:0;
    }return -1;}`},
];

/* ═══════════════════════════════════════════════════════════════════════
   FILTER CONSTANTS
═══════════════════════════════════════════════════════════════════════ */
const ALL_SHEETS = ["All","Amazon","LeetCode","Striver","Love Babbar","Coding Ninjas","GFG"];
const ALL_DIFFS  = ["All","Easy","Medium","Hard"];
const ALL_CATS   = ["All","1D Array","2D Array","String"];
const ALL_PATS   = ["All",...new Set(QUESTIONS.map(q=>q.pattern))].sort();

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════════════ */
export default function Arrays({ theme, toggleTheme }) {
  const [tab, setTab]           = useState("overview");
  const [solved, setSolved]     = useState(loadSolved);
  const [search, setSearch]     = useState("");
  const [diff, setDiff]         = useState("All");
  const [sheet, setSheet]       = useState("All");
  const [cat, setCat]           = useState("All");
  const [pat, setPat]           = useState("All");
  const [openQ, setOpenQ]       = useState(null);
  const [qPane, setQPane]       = useState({}); // {id: 'brute'|'optimal'|'info'}
  const [openAlgo, setOpenAlgo] = useState(null);
  const [copiedId, setCopied]   = useState(null);
  const [openDay, setOpenDay]   = useState(null);

  // Persist solved to localStorage on change
  useEffect(() => saveSolved(solved), [solved]);

  const toggleSolved = useCallback((id, e) => {
    e?.stopPropagation();
    setSolved(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const copyCode = useCallback((code, id) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    });
  }, []);

  const filteredQs = useMemo(() => QUESTIONS.filter(q => {
    const ms = !search || q.name.toLowerCase().includes(search.toLowerCase())
      || q.pattern.toLowerCase().includes(search.toLowerCase())
      || q.num.toLowerCase().includes(search.toLowerCase())
      || q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
      || q.algo.toLowerCase().includes(search.toLowerCase());
    const md = diff === "All" || q.difficulty === diff;
    const msh = sheet === "All" || q.sheets.includes(sheet);
    const mc = cat === "All" || q.cat === cat || (cat === "2D Array" && q.cat === "2D Array") || (cat === "String" && q.cat === "String");
    const mp = pat === "All" || q.pattern === pat;
    return ms && md && msh && mc && mp;
  }), [search, diff, sheet, cat, pat]);

  const stats = useMemo(() => ({
    total: QUESTIONS.length,
    easy: QUESTIONS.filter(q=>q.difficulty==="Easy").length,
    medium: QUESTIONS.filter(q=>q.difficulty==="Medium").length,
    hard: QUESTIONS.filter(q=>q.difficulty==="Hard").length,
    amazon: QUESTIONS.filter(q=>q.sheets.includes("Amazon")).length,
    solved: solved.size,
  }), [solved]);

  const TABS = [
    {id:"overview",   label:"📊 Overview"},
    {id:"plan",       label:"📅 10-Day Plan"},
    {id:"patterns",   label:"🔀 Patterns"},
    {id:"algorithms", label:"⚙️ Algorithms"},
    {id:"questions",  label:`💯 Questions (${stats.solved}/${stats.total})`},
    {id:"cheatsheet", label:"📋 Cheat Sheet"},
  ];

  const CodeBlock = ({code, id}) => (
    <div style={{position:'relative',marginTop:'10px'}}>
      <button
        onClick={() => copyCode(code, id)}
        style={{position:'absolute',top:'10px',right:'10px',zIndex:10}}
        className="btn btn-accent">
        {copiedId===id ? "✓ Copied" : "⎘ Copy"}
      </button>
      <SyntaxHighlighter
        language="java"
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: 'var(--radius-md)',
          background: 'rgba(0,0,0,0.2)',
          padding: '16px',
          fontSize: '13px',
          border: '1px solid var(--border)',
          lineHeight: '1.6'
        }}
        codeTagProps={{style: {fontFamily: "'JetBrains Mono', monospace"}}}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-base)',color:'var(--text-primary)',fontFamily:"'Outfit','Inter',-apple-system,system-ui,sans-serif"}}>

      {/* ── HEADER ── */}
      <div style={{borderBottom:'1px solid var(--border)',background:'var(--bg-glass)',backdropFilter:'blur(20px)',WebkitBackdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'28px 20px'}}>
          {/* macOS traffic lights */}
          <div className="macos-dots" style={{marginBottom:'16px'}}>
            <span className="dot-red"></span>
            <span className="dot-amber"></span>
            <span className="dot-green"></span>
          </div>
          <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px',marginBottom:'12px'}}>
            <span className="badge badge-accent" style={{textTransform:'uppercase',letterSpacing:'0.08em'}}>Amazon SDE1 Complete Prep</span>
            <span className="badge" style={{color:'var(--green)',background:'var(--green-soft)',borderColor:'rgba(16,185,129,0.3)'}}>
              {stats.solved}/{stats.total} Solved — {Math.round(stats.solved/stats.total*100)}%
            </span>
            <span className="badge badge-muted">☁️ Auto-saved</span>
          </div>
          <h1 style={{fontSize:'clamp(28px,5vw,48px)',fontWeight:900,letterSpacing:'-0.03em',lineHeight:1.1,background:'linear-gradient(135deg,var(--navi-green) 0%,#0866FF 60%,var(--navi-green) 100%)',backgroundSize:'200% auto',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text',margin:'0 0 8px',animation:'gradientShift 6s linear infinite'}}>
            DSA Mastery Dashboard
          </h1>
          <p className="font-mono" style={{color:'var(--accent)',fontSize:'13px',fontWeight:600,marginBottom:'16px'}}>
            // Arrays · Strings · {stats.total} Questions · 12 Patterns · 12 Algorithms · 10-Day Plan
          </p>
          <div style={{height:'4px',background:'var(--border)',borderRadius:'4px',maxWidth:'480px',overflow:'hidden'}}>
            <div className="progress-bar" style={{height:'100%',borderRadius:'4px',width:`${(stats.solved/stats.total)*100}%`,transition:'width 0.7s cubic-bezier(0.4,0,0.2,1)'}}/>
          </div>
        </div>
      </div>

      {/* ── NAV ── */}
      <div style={{position:'sticky',top:0,zIndex:50,background:'var(--bg-glass)',backdropFilter:'blur(24px)',WebkitBackdropFilter:'blur(24px)',borderBottom:'1px solid var(--border)'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 20px',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'12px'}} className="scrollbar-hide">
          <div style={{display:'flex',overflowX:'auto',flex:1}} className="scrollbar-hide">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`tab-item${tab===t.id?' active':''}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Quick Action Navigation & Theme Toggling */}
          <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0,padding:'8px 0'}}>
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="btn" title="Toggle Theme" style={{padding:'8px',borderRadius:'8px',background:'var(--bg-elevated)',borderColor:'var(--border)',color:'var(--text-secondary)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {theme === "dark" ? <Sun size={14}/> : <Moon size={14}/>}
            </button>
            {/* Return Portal */}
            <a href="#home" className="btn btn-accent" style={{fontSize:'12px',fontWeight:700,padding:'6px 12px',borderRadius:'8px',textDecoration:'none',display:'inline-flex',alignItems:'center',gap:'4px'}}>
              🏠 Home
            </a>
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1280px',margin:'0 auto',padding:'32px 20px'}}>

        {/* ════════════ OVERVIEW ════════════ */}
        {tab==="overview" && (
          <div>
            {/* Stats grid */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(100px,1fr))',gap:'12px',marginBottom:'36px'}}>
              {[
                {v:stats.total,l:"Total",c:'var(--accent)'},
                {v:stats.easy,l:"Easy",c:'var(--green)'},
                {v:stats.medium,l:"Medium",c:'var(--amber)'},
                {v:stats.hard,l:"Hard",c:'var(--red)'},
                {v:stats.amazon,l:"Amazon ⭐",c:'#facc15'},
                {v:stats.solved,l:"Solved",c:'var(--violet)'},
              ].map(s=>(
                <div key={s.l} className="stat-card">
                  <div style={{fontSize:'26px',fontWeight:800,color:s.c,marginBottom:'4px'}}>{s.v}</div>
                  <div className="font-mono" style={{fontSize:'11px',color:'var(--text-muted)'}}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Amazon Reality */}
            <div style={{background:'rgba(217,119,87,0.05)',border:'1px solid rgba(217,119,87,0.2)',borderRadius:'var(--radius-xl)',padding:'24px',marginBottom:'28px'}}>
              <h2 style={{fontWeight:800,color:'var(--accent)',fontSize:'16px',marginBottom:'16px',margin:'0 0 16px'}}>⭐ Amazon SDE1 Interview Reality (15 Years Insight)</h2>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'20px',fontSize:'13px'}}>
                {[
                  {title:"What gets asked 80%",items:["Two Sum/Container Water variants (2P)","Sliding window min/max subarray","Subarray sum=k (prefix+HashMap)","Merge/Insert intervals (sort+greedy)","Kadane's and product subarray","Trapping Rain Water (appears ~40% rounds)","Matrix rotation/spiral/search","Binary search on rotated/answer space"]},
                  {title:"Common failure points",items:["Sliding window with negatives (use prefix!)","Missing {0:1} in prefix map","Not randomizing QuickSort pivot","Forgetting k%=n in rotate array","Dutch Flag: incrementing mid after hi swap","Boyer-Moore without verification","Off-by-one in binary search (lo<hi vs lo<=hi)","Integer overflow: use long for sums"]},
                  {title:"Interview protocol",items:["Clarify: sorted? negatives? in-place? duplicates?","State brute force first with complexity","Say: 'I can optimize using [pattern]'","Write clean code with meaningful names","Trace through provided example","State time AND space complexity","Mention all edge cases: empty, single, all-same","Verify against interviewer's test case"]},
                ].map(col=>(
                  <div key={col.title}>
                    <div className="font-mono" style={{fontWeight:700,color:'var(--text-primary)',marginBottom:'8px',fontSize:'11px',textTransform:'uppercase',letterSpacing:'0.08em'}}>{col.title}</div>
                    <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:'5px'}}>
                      {col.items.map((item,i)=>(
                        <li key={i} style={{color:'var(--text-secondary)',fontSize:'12px',display:'flex',gap:'8px'}}>
                          <span style={{color:'var(--accent)',marginTop:'2px',flexShrink:0}}>›</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Pattern grid */}
            <h2 style={{fontSize:'20px',fontWeight:800,marginBottom:'16px',margin:'0 0 16px'}}>12 Patterns to Master</h2>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'12px'}}>
              {[
                {icon:"👆",name:"Two Pointer",tc:"O(n)",n:12,desc:"Opposite ends or same direction. Replaces nested loops on sorted arrays. Dutch Flag extends to 3 pointers.",ex:"3Sum, Container Water, Trapping Rain"},
                {icon:"🪟",name:"Sliding Window",tc:"O(n)",n:9,desc:"Fixed or variable window. Only works with positive numbers for sum problems. Variable: shrink while condition violated.",ex:"Min Window Substring, Sliding Max"},
                {icon:"➕",name:"Prefix Sum",tc:"O(n)",n:8,desc:"Range queries O(1). Subarray sum=k with HashMap. ALWAYS init {0:1}. Works with negatives.",ex:"Subarray Sum=K, Product Except Self"},
                {icon:"🔍",name:"Binary Search",tc:"O(log n)",n:10,desc:"Exact/bound/answer-space. lo+(hi-lo)/2 avoids overflow. Answer-space: isValid function on answer range.",ex:"Allocate Pages, Koko, Median 2 Arrays"},
                {icon:"📈",name:"Kadane's",tc:"O(n)",n:7,desc:"Extend or restart subarray. Track min AND max for products. State machine DP for stocks.",ex:"Max Subarray, Max Product, Stock III"},
                {icon:"🚦",name:"Dutch National Flag",tc:"O(n)",n:3,desc:"3-way partition in one pass. BUG: don't increment mid after hi swap.",ex:"Sort Colors, Wiggle Sort"},
                {icon:"📚",name:"Monotonic Stack",tc:"O(n) amort",n:6,desc:"Decreasing for next-greater. Histogram area with sentinel 0. Width = i - stack.peek() - 1.",ex:"Daily Temps, Histogram, Maximal Rect"},
                {icon:"🔄",name:"Cyclic Sort",tc:"O(n)",n:5,desc:"Place nums[i] at index nums[i]-1 for [1..n] arrays. Find missing/duplicate in O(1) space.",ex:"First Missing Positive, Find Duplicates"},
                {icon:"💡",name:"Bit Manipulation",tc:"O(n)",n:5,desc:"XOR for pairs. Single Number uses a^a=0. Floyd's cycle for implicit linked list.",ex:"Single Number I/II/III, Missing Number"},
                {icon:"🏃",name:"Greedy",tc:"O(n log n)",n:8,desc:"Locally optimal = globally optimal. Interval: sort by end for removal, by start for merge.",ex:"Gas Station, Jump Game, Candy"},
                {icon:"🎲",name:"DP on Arrays",tc:"O(n–n²)",n:6,desc:"House Robber O(1) space. LIS patience sorting O(n log n). Knapsack: iterate j backwards.",ex:"House Robber, LIS, Partition Subset"},
                {icon:"🔢",name:"HashMap/HashSet",tc:"O(n)",n:8,desc:"Boyer-Moore voting. Group by frequency/sorted key. MUST verify Boyer-Moore if majority not guaranteed.",ex:"Majority I/II, Group Anagrams, Longest Cons"},
              ].map(p=>(
                <div key={p.name} className="collapse-card" style={{padding:'16px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px'}}>
                    <span style={{fontSize:'20px'}}>{p.icon}</span>
                    <span style={{fontWeight:700,color:'var(--text-primary)',fontSize:'14px'}}>{p.name}</span>
                    <span className="badge badge-accent" style={{marginLeft:'auto'}}>{p.tc}</span>
                  </div>
                  <p style={{fontSize:'12px',color:'var(--text-secondary)',lineHeight:1.6,marginBottom:'8px',margin:'0 0 8px'}}>{p.desc}</p>
                  <div className="font-mono" style={{fontSize:'11px',color:'var(--text-muted)'}}>eg: {p.ex}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════ 10-DAY PLAN ════════════ */}
        {tab==="plan" && (
          <div>
            <div style={{background:'var(--red-soft)',border:'1px solid var(--red)',borderRadius:'var(--radius-lg)',padding:'16px',marginBottom:'24px',opacity:0.8}}>
              <p style={{color:'var(--red)',fontWeight:800,fontSize:'14px'}}>🔴 Protocol: 8-9 hrs/day. Theory 2h → Solve 5-6 problems 4h → Revise all 1.5h → Write templates from memory 1h. ZERO skipping.</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(400px,1fr))',gap:'16px'}}>
              {PLAN.map(d=>(
                <div key={d.day} className="collapse-card">
                  <button onClick={()=>setOpenDay(openDay===d.day?null:d.day)}
                    style={{width:'100%',padding:'20px',display:'flex',alignItems:'center',gap:'16px',background:'transparent',border:'none',cursor:'pointer',textAlign:'left'}}>
                    <div style={{width:'56px',height:'56px',borderRadius:'16px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900,fontSize:'20px',border:'1px solid',background:`${d.color}15`,borderColor:`${d.color}40`,color:d.color,flexShrink:0}}>D{d.day}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontWeight:800,color:'var(--text-primary)',fontSize:'15px',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{d.title}</div>
                      <div className="font-mono" style={{fontSize:'12px',color:d.color,marginTop:'4px'}}>{d.focus} · {d.time}</div>
                    </div>
                    <span style={{color:'var(--text-secondary)',fontSize:'12px'}}>{openDay===d.day?"▲":"▼"}</span>
                  </button>
                  {openDay===d.day && (
                    <div className="fade-in" style={{borderTop:'1px solid var(--border)',padding:'24px',display:'flex',flexDirection:'column',gap:'20px',background:'var(--bg-glass)',backdropFilter:'blur(20px)'}}>
                      <div>
                        <div className="font-mono" style={{fontSize:'11px',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:'12px'}}>Theory & Concepts</div>
                        <ul style={{listStyle:'none',padding:0,margin:0,display:'flex',flexDirection:'column',gap:'6px'}}>{d.theory.map((t,i)=>
                          <li key={i} style={{fontSize:'13px',color:'var(--text-secondary)',display:'flex',gap:'10px'}}><span style={{color:d.color}}>→</span>{t}</li>)}</ul>
                      </div>
                      <div>
                        <div className="font-mono" style={{fontSize:'11px',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:'12px'}}>Problems to Solve</div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:'8px'}}>{d.problems.map((p,i)=>
                          <span key={i} className="font-mono" style={{fontSize:'12px',background:'var(--bg-hover)',border:'1px solid var(--border)',color:'var(--text-primary)',padding:'4px 10px',borderRadius:'6px'}}>{p}</span>)}</div>
                      </div>
                      <div style={{background:'var(--amber-soft)',border:'1px solid var(--amber)',borderRadius:'var(--radius-md)',padding:'14px',opacity:0.9}}>
                        <span style={{fontSize:'12px',fontWeight:800,color:'var(--amber)'}}>💡 Key Insight: </span>
                        <span style={{fontSize:'13px',color:'var(--text-primary)'}}>{d.insight}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ════════════ PATTERNS ════════════ */}
        {tab==="patterns" && (
          <div className="space-y-4">
            {[
              {name:"Two Pointer",icon:"👆",tc:"O(n)",sc:"O(1)",
               when:["Sorted array + find pair/triplet summing to target","Remove duplicates in-place (sorted)","Partition array into groups","Dutch National Flag (3 groups)","Floyd's Cycle Detection (slow/fast)"],
               note:"Move the SHORTER line inward in Container Water. Skip duplicates at ALL pointer positions in 3Sum.",
               code:`// Opposite ends (sorted)
int lo=0,hi=arr.length-1;
while(lo<hi){
    if(condition(arr[lo],arr[hi])){// process; lo++;hi--;}
    else if(needBigger)lo++;else hi--;
}
// Dutch National Flag (3-way partition)
int lo=0,mid=0,hi=arr.length-1;
while(mid<=hi){
    if(arr[mid]==0)swap(arr,lo++,mid++);      // 0: front
    else if(arr[mid]==1)mid++;                 // 1: correct
    else swap(arr,mid,hi--);                   // 2: back, NO mid++
}`},
              {name:"Sliding Window",icon:"🪟",tc:"O(n)",sc:"O(k)",
               when:["Max/min sum of exactly k elements (fixed)","Longest subarray satisfying condition (variable)","Permutation in string check","⚠️ ONLY with positive numbers for sum"],
               note:"For subarrays with NEGATIVE numbers: use Prefix Sum + HashMap. Sliding window fails with negatives.",
               code:`// Fixed window of size k
int sum=0,max=0;
for(int i=0;i<arr.length;i++){
    sum+=arr[i];
    if(i>=k)sum-=arr[i-k];
    if(i>=k-1)max=Math.max(max,sum);
}
// Variable window (positive numbers only)
int lo=0;
for(int hi=0;hi<arr.length;hi++){
    // add arr[hi] to state
    while(conditionViolated()){
        // remove arr[lo] from state
        lo++;
    }
    max=Math.max(max,hi-lo+1);
}`},
              {name:"Prefix Sum + HashMap",icon:"➕",tc:"O(n)",sc:"O(n)",
               when:["Count subarrays with sum=k (positive AND negative numbers)","Longest subarray with sum=k","Count subarrays divisible by k","Subarrays with equal 0s and 1s"],
               note:"MUST init map with {0:1}. Forgetting this loses count of subarrays starting at index 0.",
               code:`// UNIVERSAL TEMPLATE — works with any numbers
Map<Integer,Integer> map=new HashMap<>();
map.put(0,1); // CRITICAL: empty prefix
int prefix=0,count=0;
for(int num:arr){
    prefix+=num;
    count+=map.getOrDefault(prefix-k,0);
    map.merge(prefix,1,Integer::sum);
}
// For longest (not count), store FIRST occurrence:
// map.putIfAbsent(prefix,i) — never overwrite first`},
              {name:"Binary Search Templates",icon:"🔍",tc:"O(log n)",sc:"O(1)",
               when:["Template 1: Exact match in sorted array","Template 2: Lower/upper bound queries","Template 3: Answer-space (minimize max, maximize min)","Rotated sorted array search"],
               note:"NEVER use (lo+hi)/2 — causes integer overflow. Always use lo+(hi-lo)/2.",
               code:`// T1: Exact match
while(lo<=hi){int m=lo+(hi-lo)/2;if(a[m]==t)return m;if(a[m]<t)lo=m+1;else hi=m-1;}
// T2: First true (lo < hi, NOT <=)
while(lo<hi){int m=lo+(hi-lo)/2;if(a[m]>=t)hi=m;else lo=m+1;}return lo;
// T3: Answer space (minimize feasible answer)
int lo=minFeasible,hi=maxFeasible;
while(lo<hi){int m=lo+(hi-lo)/2;
    if(isValid(arr,m))hi=m;else lo=m+1;}return lo;
// T4: Rotated sorted
if(nums[lo]<=nums[mid]){ // left sorted
    if(target>=nums[lo]&&target<nums[mid])hi=mid-1;else lo=mid+1;
}else{ // right sorted
    if(target>nums[mid]&&target<=nums[hi])lo=mid+1;else hi=mid-1;}`},
              {name:"Kadane's Algorithm",icon:"📈",tc:"O(n)",sc:"O(1)",
               when:["Maximum/minimum contiguous subarray sum","Maximum contiguous subarray product","Circular maximum subarray sum"],
               note:"Product variant: save tempMax BEFORE computing new minP. Using updated maxP gives wrong minP.",
               code:`// Standard (max sum)
int max=a[0],cur=a[0];
for(int i=1;i<a.length;i++){cur=Math.max(a[i],cur+a[i]);max=Math.max(max,cur);}
// Product (track min AND max — negatives flip!)
int maxP=a[0],minP=a[0],res=a[0];
for(int i=1;i<a.length;i++){
    int t=maxP; // SAVE before overwrite!
    maxP=Math.max(a[i],Math.max(maxP*a[i],minP*a[i]));
    minP=Math.min(a[i],Math.min(t*a[i],minP*a[i]));
    res=Math.max(res,maxP);
}`},
              {name:"Monotonic Stack",icon:"📚",tc:"O(n) amort",sc:"O(n)",
               when:["Next greater/smaller element","Largest rectangle in histogram","Maximum rectangle in binary matrix","Daily temperatures, stock span"],
               note:"Histogram: sentinel 0 at end forces all remaining bars to be processed. Width formula: stack.isEmpty() ? i : i-stack.peek()-1.",
               code:`// Next Greater Element (decreasing stack)
Deque<Integer> st=new ArrayDeque<>();
for(int i=0;i<n;i++){
    while(!st.isEmpty()&&arr[i]>arr[st.peek()])
        res[st.pop()]=arr[i]; // found NGE
    st.push(i);
}
// Histogram — sentinel 0 flushes all at end
for(int i=0;i<=n;i++){int h=(i==n)?0:heights[i];
    while(!st.isEmpty()&&h<heights[st.peek()]){
        int top=st.pop();
        int w=st.isEmpty()?i:i-st.peek()-1;
        max=Math.max(max,heights[top]*w);
    }st.push(i);}`},
              {name:"Cyclic Sort",icon:"🔄",tc:"O(n)",sc:"O(1)",
               when:["Array contains values in range [1..n] or [0..n]","Find missing/duplicate number(s)","First Missing Positive"],
               note:"Skip condition: j<0 || j>=n || nums[j]==nums[i]. All three cases: out of range, or already correct.",
               code:`void cyclicSort(int[] nums){
    int i=0;
    while(i<nums.length){
        int j=nums[i]-1; // nums[i] belongs at index j
        if(j>=0&&j<nums.length&&nums[j]!=nums[i])
            swap(nums,i,j); // place at correct index
        else i++; // skip: out-of-range or already correct
    }
}
// After: scan for nums[i]!=i+1 → i+1 is missing
// If nums[i]==nums[nums[i]-1] → nums[i] is duplicate`},
              {name:"Boyer-Moore Voting",icon:"🗳",tc:"O(n)",sc:"O(1)",
               when:["Majority >n/2 (single candidate)","Majority >n/3 (two candidates)","MUST VERIFY with second pass if majority not guaranteed"],
               note:"Without verification: returns wrong answer when no majority exists. Problem 229 REQUIRES verification.",
               code:`// Majority > n/2
int cand=nums[0],cnt=1;
for(int i=1;i<nums.length;i++){
    if(cnt==0)cand=nums[i];
    cnt+=(nums[i]==cand)?1:-1;
}
// VERIFY if not guaranteed:
int actual=0;for(int n:nums)if(n==cand)actual++;
return actual>nums.length/2?cand:-1;
// For > n/3: two candidates
// Use n1,n2,c1,c2. Decrement BOTH when no match.
// THEN verify both with second pass.`},
            ].map(p=>(
              <div key={p.name} className="collapse-card">
                <div style={{padding:'16px 18px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:'12px'}}>
                  <span style={{fontSize:'22px'}}>{p.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,color:'var(--text-primary)',fontSize:'14px'}}>{p.name}</div>
                    <div style={{display:'flex',gap:'8px',marginTop:'5px'}}>
                      <span className="badge badge-accent">⏱ {p.tc}</span>
                      <span className="badge badge-muted">💾 {p.sc}</span>
                    </div>
                  </div>
                </div>
                <div style={{padding:'16px 18px'}} className="flex flex-col lg:flex-row gap-5">
                  <div className="lg:w-1/3 xl:w-1/4 shrink-0">
                    <div className="font-mono" style={{fontSize:'11px',color:'var(--accent)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'10px'}}>Use When</div>
                    <ul style={{listStyle:'none',padding:0,margin:'0 0 14px',display:'flex',flexDirection:'column',gap:'8px'}}>
                      {p.when.map((w,i)=><li key={i} style={{fontSize:'13px',color:'var(--text-primary)',display:'flex',gap:'8px',lineHeight:1.4}}><span style={{color:'var(--accent)',flexShrink:0,marginTop:'1px'}}>→</span>{w}</li>)}
                    </ul>
                    <div className="insight-box">
                      <p style={{fontSize:'12px',color:'var(--accent)',margin:0}}><span style={{fontWeight:700}}>⚠️ </span>{p.note}</p>
                    </div>
                  </div>
                  <div className="lg:w-2/3 xl:w-3/4 min-w-0">
                    <CodeBlock code={p.code} id={"pat-"+p.name}/>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════════════ ALGORITHMS ════════════ */}
        {tab==="algorithms" && (
          <div style={{display:'flex',flexDirection:'column',gap:'10px'}}>
            <div className="collapse-card" style={{padding:'14px 16px',marginBottom:'4px'}}>
              <p className="font-mono" style={{fontSize:'12px',color:'var(--accent)',margin:0}}>
                💡 Master these implementations. Amazon expects you to code from scratch, analyze complexity, and know when each is optimal.
              </p>
            </div>
            {ALGOS.map((a,i)=>(
              <div key={a.name} className={`collapse-card${openAlgo===i?' open':''}`}>
                <button onClick={()=>setOpenAlgo(openAlgo===i?null:i)}
                  style={{width:'100%',padding:'16px',display:'flex',alignItems:'center',gap:'12px',background:'none',border:'none',cursor:'pointer',textAlign:'left'}}>
                  <span style={{fontSize:'22px'}}>{a.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,color:'var(--text-primary)',fontSize:'14px'}}>{a.name}</div>
                    <div style={{display:'flex',gap:'8px',marginTop:'5px'}}>
                      <span className="badge badge-accent">⏱ {a.tc}</span>
                      <span className="badge badge-muted">💾 {a.sc}</span>
                    </div>
                  </div>
                  <span style={{color:'var(--text-muted)',fontSize:'11px'}}>{openAlgo===i?'▲':'▼'}</span>
                </button>
                {openAlgo===i && (
                  <div className="fade-in" style={{borderTop:'1px solid var(--border)',padding:'16px'}}>
                    <div style={{fontSize:'13px',color:'var(--text-secondary)',marginBottom:'12px'}}>
                      <span style={{fontWeight:700,color:'var(--violet)',fontFamily:'JetBrains Mono,monospace'}}>When: </span>{a.when}
                    </div>
                    <CodeBlock code={a.code} id={"algo-"+i}/>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ════════════ QUESTIONS ════════════ */}
        {tab==="questions" && (
          <div>
            {/* Filters */}
            <div style={{display:'flex',flexDirection:'column',gap:'12px',marginBottom:'24px'}}>
              <input value={search} onChange={e=>setSearch(e.target.value)}
                placeholder="🔍  Search by name, pattern, algo, tag, number..."
                className="search-input" />

              <div style={{display:'flex',flexWrap:'wrap',gap:'8px',alignItems:'center'}}>
                {/* Difficulty */}
                <div style={{display:'flex',gap:'4px'}}>
                  {ALL_DIFFS.map(d=>(
                    <button key={d} onClick={()=>setDiff(d)}
                      className="btn"
                      style={{
                        background:diff===d ? 'var(--bg-hover)' : 'transparent',
                        borderColor:diff===d ? (d==="Easy"?'var(--green)':d==="Medium"?'var(--amber)':d==="Hard"?'var(--red)':'var(--accent)') : 'var(--border)',
                        color:diff===d ? (d==="Easy"?'var(--green)':d==="Medium"?'var(--amber)':d==="Hard"?'var(--red)':'var(--accent)') : 'var(--text-secondary)'
                      }}>{d}</button>
                  ))}
                </div>

                {/* Category */}
                <div style={{display:'flex',gap:'4px'}}>
                  {ALL_CATS.map(c=>(
                    <button key={c} onClick={()=>setCat(c)}
                      className="btn"
                      style={{
                        background:cat===c ? 'var(--bg-hover)' : 'transparent',
                        borderColor:cat===c ? 'var(--violet)' : 'var(--border)',
                        color:cat===c ? 'var(--violet)' : 'var(--text-secondary)'
                      }}>{c}</button>
                  ))}
                </div>

                {/* Sheet */}
                <select value={sheet} onChange={e=>setSheet(e.target.value)} className="filter-select">
                  {ALL_SHEETS.map(s=><option key={s}>{s}</option>)}
                </select>

                {/* Pattern */}
                <select value={pat} onChange={e=>setPat(e.target.value)} className="filter-select">
                  {ALL_PATS.map(p=><option key={p}>{p}</option>)}
                </select>

                <span className="font-mono" style={{fontSize:'12px',color:'var(--text-muted)',marginLeft:'auto'}}>
                  {filteredQs.length} shown · {solved.size} solved
                </span>

                {/* Clear solved button */}
                {solved.size > 0 && (
                  <button onClick={()=>{if(window.confirm(`Reset all ${solved.size} solved marks?`))setSolved(new Set());}}
                    className="btn" style={{borderColor:'var(--red-soft)',color:'var(--red)'}}>
                    Reset Progress
                  </button>
                )}
              </div>
            </div>

            {/* Question List */}
            <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
              {filteredQs.map(q=>{
                const isOpen = openQ===q.id;
                const pane = qPane[q.id] || "info";
                return (
                  <div key={q.id} className={`collapse-card${isOpen?' open':''}`} style={{borderColor:solved.has(q.id)?'var(--green)':undefined}}>
                    {/* Row */}
                    <div style={{display:'flex',alignItems:'center',gap:'8px',padding:'12px 16px',cursor:'pointer'}}
                      onClick={()=>setOpenQ(isOpen?null:q.id)}>
                      <span className="font-mono" style={{fontSize:'11px',color:'var(--text-muted)',width:'28px',flexShrink:0}}>#{q.id}</span>
                      <span className={diffClasses(q.difficulty)} style={{padding:'2px 6px'}}>{q.difficulty[0]}</span>
                      <span style={{fontWeight:600,fontSize:'14px',color:'var(--text-primary)',flex:1,minWidth:0,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{q.name}</span>
                      <div className="hide-mobile" style={{display:'flex',alignItems:'center',gap:'6px',flexShrink:0}}>
                        <span className="badge badge-accent">{q.pattern}</span>
                        <span className="badge badge-muted">{q.cat}</span>
                        {q.sheets.includes("Amazon") && <span className="badge" style={{color:'#facc15',borderColor:'rgba(250,204,21,0.3)',background:'rgba(250,204,21,0.1)'}}>⭐</span>}
                      </div>
                      <button
                        onClick={(e)=>toggleSolved(q.id,e)}
                        className="btn"
                        style={{
                          marginLeft:'4px',
                          background:solved.has(q.id)?'var(--green-soft)':'transparent',
                          borderColor:solved.has(q.id)?'rgba(74,222,128,0.3)':'var(--border)',
                          color:solved.has(q.id)?'var(--green)':'var(--text-secondary)'
                        }}>
                        {solved.has(q.id)?"✓ Done":"Mark"}
                      </button>
                      <span style={{color:'var(--text-muted)',fontSize:'10px',marginLeft:'4px'}}>{isOpen?"▲":"▼"}</span>
                    </div>

                    {/* Detail */}
                    {isOpen && (
                      <div className="fade-in" style={{borderTop:'1px solid var(--border)'}}>
                        {/* Meta row */}
                        <div style={{display:'flex',flexWrap:'wrap',alignItems:'center',gap:'8px',padding:'12px 16px',background:'var(--bg-elevated)'}}>
                          <span className={diffClasses(q.difficulty)}>{q.difficulty}</span>
                          <span className="badge badge-muted">{q.cat}</span>
                          <span className="badge badge-muted">Pattern: {q.pattern}</span>
                          <span className="badge badge-muted">Algo: {q.algo}</span>
                          <span className="badge badge-muted">{q.num}</span>
                          {q.sheets.includes("Amazon") && <span className="badge" style={{color:'#facc15',borderColor:'rgba(250,204,21,0.3)',background:'rgba(250,204,21,0.1)'}}>⭐ Amazon</span>}
                          <div style={{display:'flex',gap:'4px',marginLeft:'auto'}}>
                            {q.sheets.map(s=><span key={s} className="badge badge-muted">{s}</span>)}
                          </div>
                        </div>

                        {/* Tabs */}
                        <div style={{display:'flex',borderBottom:'1px solid var(--border)'}}>
                          {["info","brute","optimal"].map(p=>(
                            <button key={p} onClick={()=>setQPane(prev=>({...prev,[q.id]:p}))}
                              className={`tab-item${pane===p?' active':''}`} style={{padding:'10px 16px'}}>
                              {p==="info"?"📋 Concept":p==="brute"?"🐢 Brute Force":"⚡ Optimal"}
                            </button>
                          ))}
                        </div>

                        <div style={{padding:'16px'}}>
                          {pane==="info" && (
                            <div>
                              <p style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.6,marginBottom:'16px',margin:'0 0 16px'}}>{q.concept}</p>
                              <div style={{display:'flex',flexWrap:'wrap',gap:'6px'}}>
                                {q.tags.map(t=><span key={t} className="badge badge-muted">{t}</span>)}
                              </div>
                            </div>
                          )}
                          {pane==="brute" && (
                            <div>
                              <div style={{display:'flex',gap:'12px',marginBottom:'12px'}}>
                                <span className="badge badge-hard">⏱ {q.brute.tc}</span>
                                <span className="badge badge-muted">💾 {q.brute.sc}</span>
                              </div>
                              <CodeBlock code={q.brute.code} id={`brute-${q.id}`}/>
                            </div>
                          )}
                          {pane==="optimal" && (
                            <div>
                              <div style={{display:'flex',gap:'12px',marginBottom:'12px'}}>
                                <span className="badge badge-easy">⏱ {q.optimal.tc}</span>
                                <span className="badge badge-muted">💾 {q.optimal.sc}</span>
                              </div>
                              <CodeBlock code={q.optimal.code} id={`opt-${q.id}`}/>
                              {q.optimal.note && (
                                <div className="insight-box" style={{marginTop:'12px'}}>
                                  <span style={{fontSize:'12px',fontWeight:700,color:'var(--accent)'}}>💡 Note: </span>
                                  <span style={{fontSize:'12px',color:'var(--text-secondary)'}}>{q.optimal.note}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredQs.length===0 && (
                <div className="text-center py-20 text-slate-600 font-mono">No questions match your filters.</div>
              )}
            </div>
          </div>
        )}

        {/* ════════════ CHEAT SHEET ════════════ */}
        {tab==="cheatsheet" && (
          <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
            {/* Pattern Recognition */}
            <div className="collapse-card" style={{padding:'20px'}}>
              <h3 style={{fontSize:'16px',fontWeight:800,color:'var(--text-primary)',marginBottom:'16px',margin:'0 0 16px'}}>🎯 Pattern Recognition: See Keyword → Pick Pattern</h3>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'12px'}}>
                {[
                  ["sorted array + pair/sum","Two Pointer (opposite ends)"],
                  ["subarray/substring with condition","Sliding Window (positives only!)"],
                  ["subarray sum = k (any numbers)","Prefix Sum + HashMap"],
                  ["find missing/duplicate in [1..n]","Cyclic Sort or XOR"],
                  ["next greater/smaller element","Monotonic Stack"],
                  ["sorted + search element","Binary Search"],
                  ["rotated sorted array","Modified Binary Search"],
                  ["minimize maximum / maximize minimum","Binary Search on Answer"],
                  ["kth largest/smallest","Min-Heap (size k) or QuickSelect"],
                  ["count inversions / sort stability","Merge Sort"],
                  ["max/min contiguous subarray sum","Kadane's Algorithm"],
                  ["max product subarray","Kadane's (track min too)"],
                  ["0s 1s 2s sort in one pass","Dutch National Flag"],
                  ["majority element appears >n/2","Boyer-Moore + verify"],
                  ["overlapping intervals merge","Sort by START + greedy merge"],
                  ["interval removal minimum","Sort by END + greedy"],
                  ["stock buy/sell at most 2 transactions","State Machine DP (4 states)"],
                  ["jump to reach end","Greedy BFS (levels)"],
                  ["non-adjacent max sum","House Robber DP"],
                  ["equal sum partition possible?","0/1 Knapsack DP"],
                  ["rotate matrix in-place","Transpose + Reverse Rows"],
                  ["search sorted matrix (rows + cols sorted)","Top-Right Corner Strategy"],
                  ["max rectangle in 0/1 matrix","Histogram + Monotonic Stack"],
                  ["palindrome substring count","Expand Around Center"],
                  ["string segmentation DP","Word Break DP"],
                ].map(([kw,pat],i)=>(
                  <div key={i} style={{display:'flex',flexDirection:'column',gap:'6px',padding:'12px',background:'var(--bg-elevated)',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)'}}>
                    <div style={{display:'flex',gap:'6px',alignItems:'flex-start'}}>
                      <span className="font-mono" style={{color:'var(--accent)',flexShrink:0}}>→</span>
                      <span className="font-mono" style={{color:'var(--text-secondary)',fontSize:'12px',lineHeight:1.4}}>{kw}</span>
                    </div>
                    <span style={{fontWeight:700,color:'var(--text-primary)',fontSize:'13px',paddingLeft:'20px'}}>{pat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Complexity Reference */}
            <div className="collapse-card" style={{padding:'20px'}}>
              <h3 style={{fontSize:'16px',fontWeight:800,color:'var(--text-primary)',marginBottom:'16px',margin:'0 0 16px'}}>📊 Complexity Quick Reference</h3>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'16px'}}>
                <div>
                  <div className="font-mono" style={{fontSize:'10px',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'8px'}}>Time Complexities</div>
                  {[
                    ["O(1)","Hash table ops, array index, swap"],
                    ["O(log n)","Binary search, heap ops, balanced BST"],
                    ["O(n)","Linear scan, Two Pointer, Kadane's, Prefix Sum"],
                    ["O(n log n)","Sort, Merge Sort, Heap Sort, LIS"],
                    ["O(n²)","Nested loops, brute force pairs, naive DP"],
                    ["O(n·sum)","Knapsack DP (n=items, sum=target)"],
                    ["O(mn)","Matrix traversal, 2D DP"],
                    ["O(2^n)","Recursive subsets, exponential search"],
                  ].map(([tc,desc])=>(
                    <div key={tc} style={{display:'flex',gap:'12px',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
                      <span className="font-mono" style={{color:'var(--amber)',fontSize:'12px',width:'96px',flexShrink:0}}>{tc}</span>
                      <span style={{fontSize:'12px',color:'var(--text-secondary)'}}>{desc}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-mono" style={{fontSize:'10px',color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'8px'}}>Common Bugs to Avoid</div>
                  {[
                    ["Integer overflow","Use long when multiplying or summing n² values"],
                    ["Dutch Flag mid++","After swap with hi, DON'T increment mid"],
                    ["Sliding window + negatives","Use prefix+HashMap, NOT sliding window"],
                    ["Prefix map init","ALWAYS put(0,1) before processing"],
                    ["BS overflow","Use lo+(hi-lo)/2, NOT (lo+hi)/2"],
                    ["Boyer-Moore verify","Verify candidate if majority not guaranteed"],
                    ["Floyd's reset","Reset slow to nums[0], NOT to index 0"],
                    ["Rotate k%=n","Always k%=n before rotating"],
                    ["BS lo<hi vs lo<=hi","Template 1: <=. Template 2 (bound): <"],
                    ["Kadane product tempMax","Save maxP BEFORE computing minP"],
                  ].map(([bug,fix])=>(
                    <div key={bug} style={{display:'flex',gap:'12px',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
                      <span className="font-mono" style={{color:'var(--red)',fontSize:'12px',width:'112px',flexShrink:0}}>{bug}</span>
                      <span style={{fontSize:'12px',color:'var(--text-secondary)'}}>{fix}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Java Utilities */}
            <div className="collapse-card" style={{padding:'20px'}}>
              <h3 style={{fontSize:'16px',fontWeight:800,color:'var(--text-primary)',marginBottom:'16px',margin:'0 0 16px'}}>☕ Java Array Utilities Reference</h3>
              <CodeBlock code={`// Sorting
Arrays.sort(arr);                          // O(n log n) — dual-pivot quicksort
Arrays.sort(arr, 0, k);                    // sort first k elements
Arrays.sort(arr, (a,b) -> b-a);           // sort descending (autoboxed)
Arrays.sort(intervals, (a,b)->a[0]-b[0]); // sort 2D by first column
// CAREFUL: (a,b)->b-a can overflow for extreme values! Use Integer.compare(b,a)

// Array operations
Arrays.fill(arr, -1);                      // fill with value
Arrays.copyOfRange(arr, i, j);             // subarray [i,j)  exclusive j
Arrays.copyOf(arr, newLen);               // copy with new length
Arrays.equals(a, b);                       // element-wise comparison
System.arraycopy(src,srcPos,dst,dstPos,len);

// Useful methods
int max = Arrays.stream(arr).max().getAsInt();
int sum = Arrays.stream(arr).sum();        // use long for large arrays

// Conversion
List<Integer> list = new ArrayList<>();
int[] arr = list.stream().mapToInt(i->i).toArray();

// Swap utility (define in your code)
void swap(int[] a, int i, int j) { int t=a[i]; a[i]=a[j]; a[j]=t; }

// Reverse utility
void reverse(int[] a, int lo, int hi) {
    while(lo<hi){ int t=a[lo]; a[lo++]=a[hi]; a[hi--]=t; }
}

// PriorityQueue (min-heap by default)
PriorityQueue<Integer> minH = new PriorityQueue<>();           // min-heap
PriorityQueue<Integer> maxH = new PriorityQueue<>(Collections.reverseOrder()); // max-heap
PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]); // sort by 1st element

// Deque as stack (prefer over Stack<T>)
Deque<Integer> stack = new ArrayDeque<>();
stack.push(x); stack.pop(); stack.peek(); // LIFO

// Deque as queue
Deque<Integer> queue = new ArrayDeque<>();
queue.offer(x); queue.poll(); queue.peek(); // FIFO`} id="java-utils"/>
            </div>

            {/* Interview Script */}
            <div style={{background:'rgba(168,85,247,0.05)',border:'1px solid rgba(168,85,247,0.2)',borderRadius:'var(--radius-xl)',padding:'20px'}}>
              <h3 style={{fontSize:'16px',fontWeight:800,color:'var(--text-primary)',marginBottom:'16px',margin:'0 0 16px'}}>🗣️ 7-Step Amazon Interview Script</h3>
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {[
                  {n:"1",t:"Clarify (2 min)","d":"'Can the array be empty? Can numbers be negative? Must I solve in-place? Are there duplicate values? What's the expected output for [edge case]?'"},
                  {n:"2",t:"Brute Force (1 min)","d":"'The naive O(n²) approach would be [nested loops]. This gives us [result] but is too slow for n=[10⁵].'"},
                  {n:"3",t:"Pattern Recognition (2 min)","d":"'I see this is a [Two Pointer / Sliding Window / Prefix Sum] problem because [specific reason]. This reduces us from O(n²) to O(n).'"},
                  {n:"4",t:"Walk Through Example (2 min)","d":"Trace the algorithm on the given example step by step. 'At index 2, our window is [...], sum is [...], so we [shrink/expand]...'"},
                  {n:"5",t:"Code (15-20 min)","d":"Write clean, readable code. Name variables clearly (maxLeft not ml, windowSum not s). Add a comment for each major step."},
                  {n:"6",t:"Test (5 min)","d":"Trace through example. Check edge cases: empty array, single element, all zeros, all same values, extreme values."},
                  {n:"7",t:"Complexity Analysis","d":"'Time: O(n) because each element is visited at most twice. Space: O(1) since we use only constant extra variables.'"},
                ].map(s=>(
                  <div key={s.n} style={{display:'flex',gap:'12px'}}>
                    <div className="font-mono" style={{width:'28px',height:'28px',borderRadius:'var(--radius-md)',background:'rgba(168,85,247,0.1)',border:'1px solid rgba(168,85,247,0.3)',color:'var(--violet)',fontWeight:800,fontSize:'12px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{s.n}</div>
                    <div>
                      <span style={{fontWeight:700,color:'var(--text-primary)',fontSize:'14px'}}>{s.t}: </span>
                      <span style={{color:'var(--text-secondary)',fontSize:'14px'}}>{s.d}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}