import React from 'react'

export default function App() {
  return (
    <div>App</div>
  )
}



const QUESTIONS = [
/* ══════════════ SECTION 1 — 1D ARRAYS (Easy) ══════════════ */
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

{id:2,num:"LC#53",name:"Maximum Subarray (Kadane's)",cat:"1D Array",difficulty:"Easy",
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
        curr = Math.max(nums[i], curr + nums[i]); // restart or extend
        maxSoFar = Math.max(maxSoFar, curr);
    }
    return maxSoFar;
    // To get indices: track tempStart, update start=tempStart, end=i when curr>maxSoFar
}`,note:"curr negative → past subarray is a drag → restart. Works with all negatives (returns largest single element)."}},

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

{id:4,num:"LC#217",name:"Contains Duplicate",cat:"1D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"HashMap",algo:"HashSet",tags:["hashset"],
 concept:"HashSet.add() returns false if element already present — O(1) duplicate detection.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`boolean containsDuplicate(int[] nums) {
    Arrays.sort(nums);
    for (int i = 1; i < nums.length; i++)
        if (nums[i] == nums[i-1]) return true;
    return false;
}`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`boolean containsDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int n : nums)
        if (!seen.add(n)) return true; // add() returns false if dup
    return false;
}`,note:"Set.add is O(1) average. Single pass with early exit."}},

{id:5,num:"LC#283",name:"Move Zeroes to End",cat:"1D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Two Pointer",tags:["two-pointer"],
 concept:"j = slow write pointer. Copy all non-zeros, then fill remaining with zeros.",
 brute:{tc:"O(n)",sc:"O(n)",code:`void moveZeroes(int[] nums) {
    int[] tmp = new int[nums.length]; int j = 0;
    for (int n : nums) if (n != 0) tmp[j++] = n;
    System.arraycopy(tmp, 0, nums, 0, nums.length);
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`void moveZeroes(int[] nums) {
    int j = 0; // next write position
    for (int i = 0; i < nums.length; i++)
        if (nums[i] != 0) nums[j++] = nums[i];
    while (j < nums.length) nums[j++] = 0; // fill rest with 0
}`,note:"No swapping needed — just overwrite forward then fill zeros. Maintains relative order."}},

{id:6,num:"LC#136",name:"Single Number (XOR)",cat:"1D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Bit Manipulation",algo:"XOR",tags:["xor","bit"],
 concept:"XOR: a^a=0, a^0=a. All duplicate pairs cancel → unique element remains.",
 brute:{tc:"O(n)",sc:"O(n)",code:`int singleNumber(int[] nums) {
    Map<Integer,Integer> m = new HashMap<>();
    for (int n : nums) m.merge(n, 1, Integer::sum);
    for (var e : m.entrySet()) if (e.getValue() == 1) return e.getKey();
    return -1;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int singleNumber(int[] nums) {
    int xor = 0;
    for (int n : nums) xor ^= n; // pairs cancel out (x^x=0)
    return xor;
}`,note:"XOR is commutative & associative. Order doesn't matter. No extra space needed."}},

{id:7,num:"LC#268",name:"Missing Number",cat:"1D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Bit Manipulation",algo:"Math / XOR",tags:["math","xor"],
 concept:"expectedSum = n*(n+1)/2. missing = expected − actual. Or XOR all [0..n] with all elements.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`int missingNumber(int[] nums) {
    Arrays.sort(nums);
    for (int i = 0; i < nums.length; i++)
        if (nums[i] != i) return i;
    return nums.length;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int missingNumber(int[] nums) {
    int n = nums.length;
    int expected = n * (n + 1) / 2;
    int actual = 0;
    for (int x : nums) actual += x;
    return expected - actual;
    // XOR alternative (handles overflow):
    // int xor = n;
    // for (int i=0;i<n;i++) xor ^= i ^ nums[i];
    // return xor;
}`,note:"Use long for very large n to avoid overflow: (long)n*(n+1)/2."}},

{id:8,num:"LC#169",name:"Majority Element (> n/2)",cat:"1D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Boyer-Moore",algo:"Boyer-Moore Voting",tags:["voting"],
 concept:"Boyer-Moore: candidate cancels with non-matches. Majority element always survives cancellation.",
 brute:{tc:"O(n)",sc:"O(n)",code:`int majorityElement(int[] nums) {
    Map<Integer,Integer> m = new HashMap<>();
    for (int n : nums) {
        m.merge(n, 1, Integer::sum);
        if (m.get(n) > nums.length/2) return n;
    }
    return -1;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int majorityElement(int[] nums) {
    int candidate = nums[0], count = 1;
    for (int i = 1; i < nums.length; i++) {
        if (count == 0) candidate = nums[i];
        count += (nums[i] == candidate) ? 1 : -1;
    }
    return candidate; // guaranteed to exist per problem
    // If NOT guaranteed: verify with a second pass count
}`,note:"Each cancellation removes 1 majority + 1 non-majority. Majority has net surplus."}},

{id:9,num:"LC#66",name:"Plus One",cat:"1D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Greedy",algo:"Carry Propagation",tags:["math"],
 concept:"Scan right to left. Increment digit, return if < 9. If 9 → set to 0 and carry. If all 9s → prepend 1.",
 brute:{tc:"O(n)",sc:"O(1)",code:`// No real brute force — standard approach IS optimal`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int[] plusOne(int[] digits) {
    for (int i = digits.length - 1; i >= 0; i--) {
        if (digits[i] < 9) { digits[i]++; return digits; }
        digits[i] = 0; // this digit was 9, carry over
    }
    // All digits were 9: e.g. [9,9] → [1,0,0]
    int[] res = new int[digits.length + 1];
    res[0] = 1;
    return res;
}`,note:"Edge case: [9,9,9] → [1,0,0,0]. All digits become 0, prepend 1."}},

{id:10,num:"LC#485",name:"Max Consecutive Ones",cat:"1D Array",difficulty:"Easy",
 sheets:["LeetCode","Striver"],
 pattern:"Sliding Window",algo:"Linear Scan",tags:["array"],
 concept:"Count current streak. Reset to 0 on 0. Update global max.",
 brute:{tc:"O(n)",sc:"O(1)",code:`// Already linear — no brute force needed`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int findMaxConsecutiveOnes(int[] nums) {
    int max = 0, curr = 0;
    for (int n : nums) {
        curr = (n == 1) ? curr + 1 : 0;
        max = Math.max(max, curr);
    }
    return max;
}`,note:"Simple one pass. curr resets when 0 seen."}},

{id:11,num:"LC#189",name:"Rotate Array by K",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Two Pointer",algo:"Reversal Algorithm",tags:["reversal"],
 concept:"Reverse all → reverse [0..k-1] → reverse [k..n-1]. Three reversals = O(1) space rotation.",
 brute:{tc:"O(n·k)",sc:"O(1)",code:`void rotate(int[] nums, int k) {
    k %= nums.length;
    for (int i = 0; i < k; i++) {
        int last = nums[nums.length-1];
        for (int j = nums.length-1; j > 0; j--) nums[j] = nums[j-1];
        nums[0] = last;
    }
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`void rotate(int[] nums, int k) {
    int n = nums.length;
    k %= n; // handle k > n
    reverse(nums, 0, n-1);  // reverse all
    reverse(nums, 0, k-1);  // reverse first k
    reverse(nums, k, n-1);  // reverse last n-k
}
void reverse(int[] a, int lo, int hi) {
    while (lo < hi) { int t = a[lo]; a[lo++] = a[hi]; a[hi--] = t; }
}`,note:"k %= n is critical. Without it, rotating by n is unnecessary full rotation."}},

{id:12,num:"LC#448",name:"Find All Numbers Disappeared",cat:"1D Array",difficulty:"Easy",
 sheets:["LeetCode","Striver","Love Babbar"],
 pattern:"Cyclic Sort",algo:"Index Negation",tags:["negation"],
 concept:"Negate nums[abs(nums[i])-1] to mark visited. Indices still positive → missing numbers.",
 brute:{tc:"O(n)",sc:"O(n)",code:`List<Integer> findDisappearedNumbers(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n : nums) set.add(n);
    List<Integer> res = new ArrayList<>();
    for (int i = 1; i <= nums.length; i++)
        if (!set.contains(i)) res.add(i);
    return res;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`List<Integer> findDisappearedNumbers(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        int idx = Math.abs(nums[i]) - 1;
        if (nums[idx] > 0) nums[idx] = -nums[idx]; // mark visited
    }
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < nums.length; i++)
        if (nums[i] > 0) res.add(i + 1); // still positive = missing
    return res;
}`,note:"Math.abs() handles already-negated values. Output array not extra space per LC convention."}},

{id:13,num:"LC#1752",name:"Check if Array is Sorted and Rotated",cat:"1D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Greedy",algo:"Count Drops",tags:["array"],
 concept:"At most ONE drop (nums[i] > nums[i+1]) allowed in a sorted+rotated array. Check circular.",
 brute:{tc:"O(n log n)",sc:"O(n)",code:`boolean check(int[] nums) {
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    // Try all rotations
    for (int r = 0; r < nums.length; r++) {
        boolean ok = true;
        for (int i = 0; i < nums.length; i++)
            if (nums[(i+r)%nums.length] != sorted[i]) { ok=false; break; }
        if (ok) return true;
    }
    return false;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean check(int[] nums) {
    int n = nums.length, drops = 0;
    for (int i = 0; i < n; i++)
        if (nums[i] > nums[(i+1)%n]) drops++; // circular check
    return drops <= 1; // 0=sorted, 1=rotated once
}`,note:"Circular wrap-around: compare last with first. drops>1 means array has multiple unsorted segments."}},

{id:14,num:"LC#724",name:"Find Pivot Index",cat:"1D Array",difficulty:"Easy",
 sheets:["LeetCode","Striver"],
 pattern:"Prefix Sum",algo:"Prefix Sum",tags:["prefix-sum"],
 concept:"leftSum == total - leftSum - nums[i]. Single variable, no extra array.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int pivotIndex(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        int left = 0, right = 0;
        for (int j = 0; j < i; j++) left += nums[j];
        for (int j = i+1; j < nums.length; j++) right += nums[j];
        if (left == right) return i;
    }
    return -1;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int pivotIndex(int[] nums) {
    int total = 0;
    for (int n : nums) total += n;
    int left = 0;
    for (int i = 0; i < nums.length; i++) {
        // right = total - left - nums[i]
        if (left == total - left - nums[i]) return i;
        left += nums[i];
    }
    return -1;
}`,note:"right = total - left - nums[i]. No need to store right sum explicitly."}},

{id:15,num:"LC#75",name:"Sort Colors (Dutch National Flag)",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Dutch Flag",algo:"Three-Way Partition",tags:["three-pointer"],
 concept:"lo(0s zone end), mid(current), hi(2s zone start). One pass. CRITICAL: don't increment mid after swapping with hi.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`void sortColors(int[] nums) {
    // Count then fill - 2 passes
    int c0=0, c1=0, c2=0;
    for (int n : nums) { if(n==0)c0++; else if(n==1)c1++; else c2++; }
    int i=0;
    while(c0-->0)nums[i++]=0; while(c1-->0)nums[i++]=1; while(c2-->0)nums[i++]=2;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`void sortColors(int[] nums) {
    int lo=0, mid=0, hi=nums.length-1;
    while (mid <= hi) {
        if (nums[mid] == 0) {
            swap(nums, lo++, mid++); // 0: send to front, both advance
        } else if (nums[mid] == 1) {
            mid++;                   // 1: correct position
        } else {                     // 2: send to back
            swap(nums, mid, hi--);   // DO NOT mid++ — re-examine swapped value!
        }
    }
}`,note:"BUG TRAP: when swapping with hi, the element from hi is unseen — must NOT increment mid."}},

/* ══════════════ SECTION 2 — 1D ARRAYS (Medium) ══════════════ */
{id:16,num:"LC#560",name:"Subarray Sum Equals K",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Prefix Sum",algo:"Prefix Sum + HashMap",tags:["prefix-sum","hashmap"],
 concept:"If prefixSum[j]-prefixSum[i]=k then subarray [i+1..j] has sum k. Init map {0:1} for subarrays starting at 0. Works with negatives.",
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
    map.put(0, 1); // CRITICAL: empty prefix has sum 0
    int count = 0, prefix = 0;
    for (int n : nums) {
        prefix += n;
        count += map.getOrDefault(prefix - k, 0);
        map.merge(prefix, 1, Integer::sum);
    }
    return count;
}`,note:"SLIDING WINDOW DOES NOT WORK HERE (negatives present). Always use prefix+HashMap for subarrays with negatives."}},

{id:17,num:"LC#238",name:"Product of Array Except Self",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Prefix Sum",algo:"Prefix × Suffix Product",tags:["prefix","suffix"],
 concept:"Pass1: result[i]=product of all left elements. Pass2: multiply suffix products from right. No division. O(1) extra.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int[] productExceptSelf(int[] nums) {
    int n = nums.length; int[] res = new int[n];
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
    // Pass 1: prefix products
    res[0] = 1;
    for (int i = 1; i < n; i++) res[i] = res[i-1] * nums[i-1];
    // Pass 2: multiply suffix products
    int suffix = 1;
    for (int i = n-1; i >= 0; i--) {
        res[i] *= suffix;
        suffix *= nums[i];
    }
    return res;
}`,note:"Output array is not counted as extra space. suffix variable avoids O(n) suffix array."}},

{id:18,num:"LC#15",name:"3Sum",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Two Pointer",algo:"Sort + Two Pointer",tags:["two-pointer","sorting"],
 concept:"Sort. Fix nums[i], two-pointer on rest. Skip duplicates at all 3 pointer positions carefully.",
 brute:{tc:"O(n³)",sc:"O(n)",code:`// 3 nested loops + HashSet dedup — O(n³)`},
 optimal:{tc:"O(n²)",sc:"O(1)",code:`List<List<Integer>> threeSum(int[] nums) {
    Arrays.sort(nums);
    List<List<Integer>> res = new ArrayList<>();
    for (int i = 0; i < nums.length-2; i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue; // skip dup i
        int lo = i+1, hi = nums.length-1;
        while (lo < hi) {
            int sum = nums[i]+nums[lo]+nums[hi];
            if (sum == 0) {
                res.add(Arrays.asList(nums[i],nums[lo],nums[hi]));
                while (lo<hi && nums[lo]==nums[lo+1]) lo++; // skip dup lo
                while (lo<hi && nums[hi]==nums[hi-1]) hi--; // skip dup hi
                lo++; hi--;
            } else if (sum < 0) lo++;
            else hi--;
        }
    }
    return res;
}`,note:"Duplicate skipping is crucial. Sort enables two-pointer reduction from O(n³) to O(n²)."}},

{id:19,num:"LC#11",name:"Container With Most Water",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Two Pointer",algo:"Greedy Two Pointer",tags:["two-pointer","greedy"],
 concept:"Always move the SHORTER line inward. Proof: moving taller can only decrease width while min height stays same or worse.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int maxArea(int[] h) {
    int max = 0;
    for (int i=0;i<h.length;i++)
        for (int j=i+1;j<h.length;j++)
            max=Math.max(max,(j-i)*Math.min(h[i],h[j]));
    return max;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int maxArea(int[] height) {
    int lo=0, hi=height.length-1, max=0;
    while (lo < hi) {
        max = Math.max(max, (hi-lo)*Math.min(height[lo],height[hi]));
        if (height[lo] < height[hi]) lo++; // shorter limits, move it
        else hi--;
    }
    return max;
}`,note:"Area = width × min(heights). Moving shorter side is the only chance to find better area."}},

{id:20,num:"LC#42",name:"Trapping Rain Water",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Two Pointer",algo:"Two Pointer / Prefix Max Arrays",tags:["two-pointer","prefix"],
 concept:"Water at i = min(maxLeft, maxRight) − height[i]. Two-pointer: process from the shorter side — it's bounded.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int trap(int[] h) {
    int water = 0, n = h.length;
    for (int i=1; i<n-1; i++) {
        int lMax=0, rMax=0;
        for (int j=0;j<=i;j++) lMax=Math.max(lMax,h[j]);
        for (int j=i;j<n;j++) rMax=Math.max(rMax,h[j]);
        water += Math.min(lMax,rMax) - h[i];
    }
    return water;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int trap(int[] h) {
    int lo=0, hi=h.length-1, lMax=0, rMax=0, water=0;
    while (lo <= hi) {
        if (h[lo] <= h[hi]) {
            lMax = Math.max(lMax, h[lo]);
            water += lMax - h[lo]; // lMax >= h[lo] always
            lo++;
        } else {
            rMax = Math.max(rMax, h[hi]);
            water += rMax - h[hi];
            hi--;
        }
    }
    return water;
}`,note:"When h[lo]<=h[hi], left side is the bottleneck regardless of what's between — safe to process left."}},

{id:21,num:"LC#209",name:"Minimum Size Subarray Sum",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Sliding Window",algo:"Variable Sliding Window",tags:["sliding-window"],
 concept:"Variable window: expand right (add), shrink left while sum>=target. Works only with positives.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int minSubArrayLen(int target, int[] nums) {
    int min = Integer.MAX_VALUE;
    for (int i=0;i<nums.length;i++) {
        int sum=0;
        for (int j=i;j<nums.length;j++) {
            sum+=nums[j];
            if(sum>=target){min=Math.min(min,j-i+1);break;}
        }
    }
    return min==Integer.MAX_VALUE?0:min;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int minSubArrayLen(int target, int[] nums) {
    int lo=0, sum=0, min=Integer.MAX_VALUE;
    for (int hi=0; hi<nums.length; hi++) {
        sum += nums[hi];
        while (sum >= target) {        // keep shrinking while valid
            min = Math.min(min, hi-lo+1);
            sum -= nums[lo++];
        }
    }
    return min == Integer.MAX_VALUE ? 0 : min;
}`,note:"Each element added and removed at most once → O(n) total. while not if — squeeze to minimum."}},

{id:22,num:"LC#3",name:"Longest Substring Without Repeating Characters",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Sliding Window",algo:"Variable Window + HashMap",tags:["sliding-window","hashmap"],
 concept:"HashMap stores last index of each char. When duplicate found, jump left pointer to max(left, lastSeen+1). Never move left backward.",
 brute:{tc:"O(n³)",sc:"O(n)",code:`// Check every substring for uniqueness O(n³)`},
 optimal:{tc:"O(n)",sc:"O(min(n,m))",code:`int lengthOfLongestSubstring(String s) {
    Map<Character,Integer> map = new HashMap<>();
    int left=0, max=0;
    for (int r=0; r<s.length(); r++) {
        char c = s.charAt(r);
        if (map.containsKey(c))
            left = Math.max(left, map.get(c)+1); // jump past duplicate
        map.put(c, r);                            // update to latest index
        max = Math.max(max, r-left+1);
    }
    return max;
}`,note:"max(left,...) prevents left pointer from moving backward when duplicate is outside current window."}},

{id:23,num:"LC#76",name:"Minimum Window Substring",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Sliding Window",algo:"Variable Window + Frequency Map",tags:["sliding-window","hashmap"],
 concept:"Expand right until all t chars satisfied (formed==required). Shrink left to minimize. Track best window.",
 brute:{tc:"O(n²·m)",sc:"O(m)",code:`// Check all substrings — O(n²) substrings × O(m) verification`},
 optimal:{tc:"O(n+m)",sc:"O(m)",code:`String minWindow(String s, String t) {
    Map<Character,Integer> need=new HashMap<>(), have=new HashMap<>();
    for (char c:t.toCharArray()) need.merge(c,1,Integer::sum);
    int formed=0, req=need.size(), lo=0;
    int minLen=Integer.MAX_VALUE, start=0;
    for (int hi=0; hi<s.length(); hi++) {
        char c = s.charAt(hi);
        have.merge(c,1,Integer::sum);
        if(need.containsKey(c) && have.get(c).equals(need.get(c))) formed++;
        while (formed==req) {
            if (hi-lo+1 < minLen) { minLen=hi-lo+1; start=lo; }
            char lc=s.charAt(lo++);
            have.merge(lc,-1,Integer::sum);
            if(need.containsKey(lc) && have.get(lc)<need.get(lc)) formed--;
        }
    }
    return minLen==Integer.MAX_VALUE?"":s.substring(start,start+minLen);
}`,note:"formed counts chars meeting their required frequency. Shrink greedily to minimize window."}},

{id:24,num:"LC#239",name:"Sliding Window Maximum",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Sliding Window",algo:"Monotonic Deque",tags:["deque","monotonic"],
 concept:"Monotonic decreasing deque of indices. Front = max. Remove back if smaller than new element. Remove front if outside window.",
 brute:{tc:"O(n·k)",sc:"O(1)",code:`// Scan each window for max — O(nk)`},
 optimal:{tc:"O(n)",sc:"O(k)",code:`int[] maxSlidingWindow(int[] nums, int k) {
    int n=nums.length;
    int[] res = new int[n-k+1];
    Deque<Integer> dq = new ArrayDeque<>(); // stores INDICES
    for (int i=0; i<n; i++) {
        // Remove front if outside window [i-k+1, i]
        if (!dq.isEmpty() && dq.peek() < i-k+1) dq.poll();
        // Remove back elements smaller than current (they'll never be max)
        while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
        dq.offer(i);
        if (i >= k-1) res[i-k+1] = nums[dq.peek()]; // front = window max
    }
    return res;
}`,note:"Deque stores indices not values. Front is always the maximum of the current window."}},

{id:25,num:"LC#33",name:"Search in Rotated Sorted Array",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","Coding Ninjas"],
 pattern:"Binary Search",algo:"Modified Binary Search",tags:["binary-search","rotated"],
 concept:"One half is ALWAYS sorted. Identify sorted half → check if target in it → recurse there, else other side.",
 brute:{tc:"O(n)",sc:"O(1)",code:`int search(int[] nums, int target) {
    for(int i=0;i<nums.length;i++) if(nums[i]==target) return i;
    return -1;
}`},
 optimal:{tc:"O(log n)",sc:"O(1)",code:`int search(int[] nums, int target) {
    int lo=0, hi=nums.length-1;
    while (lo <= hi) {
        int mid = lo+(hi-lo)/2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid]) { // LEFT half sorted
            if (target>=nums[lo] && target<nums[mid]) hi=mid-1;
            else lo=mid+1;
        } else {                     // RIGHT half sorted
            if (target>nums[mid] && target<=nums[hi]) lo=mid+1;
            else hi=mid-1;
        }
    }
    return -1;
}`,note:"Key insight: at EVERY step one half is always monotonically sorted in a rotated sorted array."}},

{id:26,num:"LC#153",name:"Find Minimum in Rotated Sorted Array",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Binary Search",algo:"Binary Search",tags:["binary-search","rotated"],
 concept:"If nums[mid] > nums[hi], minimum is in right half. Else in left half (mid could be min, don't exclude).",
 brute:{tc:"O(n)",sc:"O(1)",code:`int findMin(int[] nums) { int min=nums[0]; for(int n:nums) min=Math.min(min,n); return min; }`},
 optimal:{tc:"O(log n)",sc:"O(1)",code:`int findMin(int[] nums) {
    int lo=0, hi=nums.length-1;
    while (lo < hi) { // note: lo < hi (not <=)
        int mid = lo+(hi-lo)/2;
        if (nums[mid] > nums[hi]) lo=mid+1; // inflection in right half
        else hi=mid;  // mid could be min, keep it
    }
    return nums[lo]; // lo == hi == answer
}`,note:"Compare mid with hi (not lo). When mid>hi, the drop is between mid and hi."}},

{id:27,num:"LC#34",name:"First and Last Position in Sorted Array",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","Coding Ninjas"],
 pattern:"Binary Search",algo:"Lower Bound + Upper Bound",tags:["binary-search"],
 concept:"Two binary searches: lower bound (first target) and upper bound (first element > target, subtract 1).",
 brute:{tc:"O(n)",sc:"O(1)",code:`int[] searchRange(int[] nums, int target) {
    int first=-1,last=-1;
    for(int i=0;i<nums.length;i++) {
        if(nums[i]==target){if(first==-1)first=i;last=i;}
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

{id:28,num:"LC#162",name:"Find Peak Element",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Binary Search",algo:"Binary Search",tags:["binary-search"],
 concept:"If nums[mid] < nums[mid+1], peak is somewhere on right (ascending slope). Otherwise peak is here or left.",
 brute:{tc:"O(n)",sc:"O(1)",code:`int findPeakElement(int[] nums) {
    for(int i=0;i<nums.length-1;i++) if(nums[i]>nums[i+1]) return i;
    return nums.length-1;
}`},
 optimal:{tc:"O(log n)",sc:"O(1)",code:`int findPeakElement(int[] nums) {
    int lo=0, hi=nums.length-1;
    while (lo < hi) {
        int mid = lo+(hi-lo)/2;
        if (nums[mid] < nums[mid+1]) lo=mid+1; // ascending → peak on right
        else hi=mid;                             // descending → peak here or left
    }
    return lo;
}`,note:"Boundaries treated as -∞ so first/last element can be peaks. Any local peak is valid."}},

{id:29,num:"LC#4",name:"Median of Two Sorted Arrays",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Binary Search",algo:"Binary Search on Partition",tags:["binary-search","divide-conquer"],
 concept:"Binary search on shorter array. Partition both so left half total = (m+n+1)/2. Check maxLeft <= minRight.",
 brute:{tc:"O(m+n)",sc:"O(m+n)",code:`// Merge both arrays then find median`},
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
            if((m+n)%2==1) return Math.max(lA,lB);
            return(Math.max(lA,lB)+Math.min(rA,rB))/2.0;
        } else if (lA>rB) hi=pA-1;
        else lo=pA+1;
    }
    return 0;
}`,note:"Binary search on how many elements to take from shorter array. Partition must satisfy maxLeft<=minRight on both sides."}},

{id:30,num:"LC#56",name:"Merge Intervals",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","GFG"],
 pattern:"Sorting",algo:"Sort + Greedy Merge",tags:["sorting","greedy"],
 concept:"Sort by start. If current.start <= last.end → overlap → extend end. Else add new interval.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// Check each pair for overlap, merge repeatedly`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a,b)->a[0]-b[0]);
    List<int[]> res = new ArrayList<>();
    for (int[] curr : intervals) {
        if (!res.isEmpty() && curr[0]<=res.get(res.size()-1)[1])
            res.get(res.size()-1)[1]=Math.max(res.get(res.size()-1)[1],curr[1]);
        else
            res.add(curr);
    }
    return res.toArray(new int[0][]);
}`,note:"Sort by start guarantees overlapping intervals are adjacent. Two intervals overlap if b.start <= a.end."}},

{id:31,num:"LC#57",name:"Insert Interval",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Sorting",algo:"Three-Phase Linear Scan",tags:["sorting","greedy"],
 concept:"Three phases: add non-overlapping before new interval, merge all overlapping, add remaining.",
 brute:{tc:"O(n log n)",sc:"O(n)",code:`// Insert into list then run merge intervals`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int[][] insert(int[][] iv, int[] ni) {
    List<int[]> res = new ArrayList<>();
    int i=0, n=iv.length;
    while (i<n && iv[i][1]<ni[0]) res.add(iv[i++]);  // before
    while (i<n && iv[i][0]<=ni[1]) {                  // overlap: merge
        ni[0]=Math.min(ni[0],iv[i][0]);
        ni[1]=Math.max(ni[1],iv[i][1]);
        i++;
    }
    res.add(ni);
    while (i<n) res.add(iv[i++]);                      // after
    return res.toArray(new int[0][]);
}`,note:"Already sorted input — O(n) with no sort. Three-phase: skip before, merge overlapping, copy rest."}},

{id:32,num:"LC#152",name:"Maximum Product Subarray",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Kadane's",algo:"Track Min & Max",tags:["dp","kadane"],
 concept:"Negatives flip max↔min. Track both maxP and minP. At each step: new max = max(num, maxP×num, minP×num).",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int maxProduct(int[] nums) {
    int res=Integer.MIN_VALUE;
    for(int i=0;i<nums.length;i++){int p=1;for(int j=i;j<nums.length;j++){p*=nums[j];res=Math.max(res,p);}}
    return res;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int maxProduct(int[] nums) {
    int maxP=nums[0], minP=nums[0], res=nums[0];
    for (int i=1; i<nums.length; i++) {
        int tempMax = maxP; // SAVE before overwrite!
        maxP=Math.max(nums[i],Math.max(maxP*nums[i],minP*nums[i]));
        minP=Math.min(nums[i],Math.min(tempMax*nums[i],minP*nums[i]));
        res=Math.max(res,maxP);
    }
    return res;
}`,note:"Save tempMax BEFORE computing minP — otherwise uses stale updated maxP."}},

{id:33,num:"LC#122",name:"Best Time to Buy Sell Stock II",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Greedy",algo:"Greedy",tags:["greedy","dp"],
 concept:"Every upward step is profit. Sum all positive differences. Valley-to-peak = sum of daily gains.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`// Recursive: try all buy/sell combinations`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int maxProfit(int[] prices) {
    int profit = 0;
    for (int i=1; i<prices.length; i++)
        if (prices[i] > prices[i-1])
            profit += prices[i]-prices[i-1]; // capture every upward step
    return profit;
}`,note:"Mathematical equivalence: valley-to-peak gain = sum of all daily positive increments."}},

{id:34,num:"LC#123",name:"Best Time to Buy Sell Stock III",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"State Machine DP",tags:["dp","state-machine"],
 concept:"4 states: buy1, sell1, buy2, sell2. sell1 feeds into buy2 (use first profit to reinvest).",
 brute:{tc:"O(n³)",sc:"O(1)",code:`// Try all pairs of non-overlapping buy-sell intervals`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int maxProfit(int[] prices) {
    int buy1=Integer.MIN_VALUE, sell1=0;
    int buy2=Integer.MIN_VALUE, sell2=0;
    for (int p : prices) {
        buy1  = Math.max(buy1, -p);        // first buy
        sell1 = Math.max(sell1, buy1+p);   // first sell
        buy2  = Math.max(buy2, sell1-p);   // second buy (using sell1 profit)
        sell2 = Math.max(sell2, buy2+p);   // second sell
    }
    return sell2;
}`,note:"sell1 funds buy2. This chaining naturally handles non-overlapping constraint."}},

{id:35,num:"LC#55",name:"Jump Game I",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Greedy",algo:"Greedy Max Reach",tags:["greedy"],
 concept:"Track maxReach = farthest reachable. If current index > maxReach, we're stuck — return false.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`// DFS/BFS from each position`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i=0; i<nums.length; i++) {
        if (i > maxReach) return false; // can't reach index i
        maxReach = Math.max(maxReach, i+nums[i]);
    }
    return true;
}`,note:"maxReach = farthest reachable from any visited position. If i exceeds it we're stuck forever."}},

{id:36,num:"LC#45",name:"Jump Game II",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Greedy",algo:"Greedy BFS",tags:["greedy","bfs"],
 concept:"Level-order BFS: at each jump level track farthest reachable. Jump count = number of levels.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// DP: dp[i] = min jumps to reach index i`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int jump(int[] nums) {
    int jumps=0, curEnd=0, farthest=0;
    for (int i=0; i<nums.length-1; i++) { // don't need to jump from last
        farthest = Math.max(farthest, i+nums[i]);
        if (i == curEnd) {   // must make a jump now
            jumps++;
            curEnd = farthest;
        }
    }
    return jumps;
}`,note:"curEnd = end of current BFS level. When i reaches curEnd, increment jump and advance level."}},

{id:37,num:"LC#134",name:"Gas Station",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Greedy",algo:"Greedy",tags:["greedy","circular"],
 concept:"If total gas >= total cost, solution exists. Whenever tank dips below 0, reset start to i+1.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`// Try each station as start O(n²)`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int canCompleteCircuit(int[] gas, int[] cost) {
    int total=0, tank=0, start=0;
    for (int i=0; i<gas.length; i++) {
        total += gas[i]-cost[i];
        tank  += gas[i]-cost[i];
        if (tank < 0) { start=i+1; tank=0; } // can't start from here or before
    }
    return total >= 0 ? start : -1;
}`,note:"If total >= 0, exactly one valid start exists. The greedy reset finds it."}},

{id:38,num:"LC#135",name:"Candy Distribution",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Greedy",algo:"Two-Pass Greedy",tags:["greedy"],
 concept:"Left pass: rating[i]>rating[i-1] → candy[i]=candy[i-1]+1. Right pass: rating[i]>rating[i+1] → candy[i]=max(candy[i],candy[i+1]+1).",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// Simulate: keep updating until stable`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int candy(int[] ratings) {
    int n=ratings.length;
    int[] candy = new int[n];
    Arrays.fill(candy, 1);
    for (int i=1;i<n;i++)   // left pass
        if(ratings[i]>ratings[i-1]) candy[i]=candy[i-1]+1;
    for (int i=n-2;i>=0;i--) // right pass
        if(ratings[i]>ratings[i+1]) candy[i]=Math.max(candy[i],candy[i+1]+1);
    int sum=0; for(int c:candy) sum+=c;
    return sum;
}`,note:"Two independent constraints resolved in two passes. Final satisfies both."}},

{id:39,num:"LC#41",name:"First Missing Positive",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","Coding Ninjas"],
 pattern:"Cyclic Sort",algo:"Cyclic Sort",tags:["cyclic-sort"],
 concept:"Place each positive number [1..n] at its correct index. Then find first mismatch — that index+1 is missing.",
 brute:{tc:"O(n)",sc:"O(n)",code:`int firstMissingPositive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for(int n:nums) set.add(n);
    for(int i=1;;i++) if(!set.contains(i)) return i;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i=0; i<n; ) {
        int j = nums[i]-1; // where nums[i] belongs
        if (j>=0 && j<n && nums[j]!=nums[i]) // valid and not already correct
            swap(nums, i, j);
        else i++;
    }
    for (int i=0; i<n; i++)
        if (nums[i] != i+1) return i+1;
    return n+1;
}`,note:"Ignore values ≤0 and >n. Inner while replaced with if+i++ to avoid infinite loop on duplicates."}},

{id:40,num:"LC#287",name:"Find the Duplicate Number",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Two Pointer",algo:"Floyd's Cycle Detection",tags:["floyd","cycle"],
 concept:"Array [1..n] as implicit linked list: i→nums[i]. Duplicate creates cycle. Floyd's finds cycle entry = duplicate.",
 brute:{tc:"O(n)",sc:"O(n)",code:`int findDuplicate(int[] nums) {
    Set<Integer> seen=new HashSet<>();
    for(int n:nums) if(!seen.add(n)) return n;
    return -1;
}`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int findDuplicate(int[] nums) {
    // Phase 1: detect cycle
    int slow=nums[0], fast=nums[0];
    do { slow=nums[slow]; fast=nums[nums[fast]]; } while(slow!=fast);
    // Phase 2: find cycle entry (= duplicate)
    slow = nums[0]; // reset slow to START of array (nums[0], not index 0)
    while (slow != fast) { slow=nums[slow]; fast=nums[fast]; }
    return slow;
}`,note:"Reset slow to nums[0] NOT 0. Both arrays start at nums[0] (the first element of the implicit linked list)."}},

{id:41,num:"LC#128",name:"Longest Consecutive Sequence",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"HashMap",algo:"HashSet",tags:["hashset"],
 concept:"Only start counting from sequence beginnings (n-1 not in set). Then count forward. O(n) total — each number processed at most twice.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`Arrays.sort(nums); // then count streaks`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int longestConsecutive(int[] nums) {
    Set<Integer> set = new HashSet<>();
    for (int n:nums) set.add(n);
    int best = 0;
    for (int n : set) {
        if (!set.contains(n-1)) { // n is sequence start
            int curr=n, len=1;
            while (set.contains(curr+1)) { curr++; len++; }
            best = Math.max(best, len);
        }
    }
    return best;
}`,note:"set.contains(n-1) check prevents counting from middle of sequence → each sequence counted exactly once."}},

{id:42,num:"LC#229",name:"Majority Element II (> n/3)",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Boyer-Moore",algo:"Extended Boyer-Moore (2 candidates)",tags:["voting"],
 concept:"At most 2 elements can appear > n/3 times. Track 2 candidates. MUST verify with second pass.",
 brute:{tc:"O(n)",sc:"O(n)",code:`// HashMap frequency count O(n) space`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`List<Integer> majorityElement(int[] nums) {
    int c1=0,c2=0, n1=Integer.MIN_VALUE, n2=Integer.MAX_VALUE;
    for (int n:nums) {
        if(n==n1)c1++;
        else if(n==n2)c2++;
        else if(c1==0){n1=n;c1=1;}
        else if(c2==0){n2=n;c2=1;}
        else{c1--;c2--;}
    }
    // CRITICAL: verify — candidates may not actually appear > n/3 times
    c1=0;c2=0;
    for(int n:nums){if(n==n1)c1++;else if(n==n2)c2++;}
    List<Integer> res=new ArrayList<>();
    if(c1>nums.length/3)res.add(n1);
    if(c2>nums.length/3)res.add(n2);
    return res;
}`,note:"MUST verify candidates with second pass. Without verification, wrong answers possible."}},

{id:43,num:"LC#84",name:"Largest Rectangle in Histogram",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Monotonic Stack",algo:"Monotonic Stack",tags:["stack","monotonic"],
 concept:"Monotonic increasing stack. When smaller bar seen, pop and calculate area. Width = i - stack.peek() - 1. Sentinel 0 at end flushes all.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`// For each bar, expand left/right while taller — O(n²)`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int largestRectangleArea(int[] heights) {
    Deque<Integer> stack = new ArrayDeque<>(); // indices
    int max=0, n=heights.length;
    for (int i=0; i<=n; i++) {
        int cur = (i==n) ? 0 : heights[i]; // sentinel 0 forces flush
        while (!stack.isEmpty() && cur < heights[stack.peek()]) {
            int h = heights[stack.pop()];
            int w = stack.isEmpty() ? i : i-stack.peek()-1;
            max = Math.max(max, h*w);
        }
        stack.push(i);
    }
    return max;
}`,note:"Sentinel 0 at end forces processing all remaining bars. Width: if stack empty, extends to index 0."}},

{id:44,num:"LC#739",name:"Daily Temperatures",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Monotonic Stack",algo:"Monotonic Decreasing Stack",tags:["stack","monotonic"],
 concept:"Decreasing stack of indices. When current temp > stack.top temp, pop and record wait time = i - index.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`// For each day, scan forward for warmer day — O(n²)`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`int[] dailyTemperatures(int[] T) {
    int[] res = new int[T.length];
    Deque<Integer> stack = new ArrayDeque<>(); // indices
    for (int i=0; i<T.length; i++) {
        while (!stack.isEmpty() && T[i]>T[stack.peek()])
            res[stack.pop()] = i - stack.peek() - 1; // BUG! fix below
        stack.push(i);
    }
    return res;
}
// CORRECT version:
int[] dailyTemperatures(int[] T) {
    int[] res = new int[T.length];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i=0; i<T.length; i++) {
        while (!stack.isEmpty() && T[i]>T[stack.peek()]) {
            int idx = stack.pop();
            res[idx] = i - idx; // days waited = current - popped index
        }
        stack.push(i);
    }
    return res;
}`,note:"res[idx] = i - idx (current index minus the popped index). Stack stores indices not temperatures."}},

{id:45,num:"LC#215",name:"Kth Largest Element",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Sorting",algo:"QuickSelect / Min-Heap",tags:["quickselect","heap"],
 concept:"Three approaches: Sort O(n log n), Min-heap size k O(n log k), QuickSelect O(n) avg. In interviews, min-heap is safest bet.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`int findKthLargest(int[] nums, int k) {
    Arrays.sort(nums); return nums[nums.length-k];
}`},
 optimal:{tc:"O(n) avg",sc:"O(1)",code:`// Min-heap O(n log k) — Interview safe choice
int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> pq = new PriorityQueue<>(); // min-heap
    for (int n:nums) {
        pq.offer(n);
        if (pq.size()>k) pq.poll(); // remove smallest
    }
    return pq.peek(); // k-th largest remains
}
// QuickSelect O(n) average:
int quickSelect(int[] a, int lo, int hi, int k) {
    int p=partition(a,lo,hi);
    if(p==k)return a[p];
    return p>k?quickSelect(a,lo,p-1,k):quickSelect(a,p+1,hi,k);
}`,note:"Min-heap guarantees O(n log k) worst case. QuickSelect O(n) average but O(n²) worst case."}},

{id:46,num:"GFG",name:"Count Inversions",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","Striver","Love Babbar","GFG","Coding Ninjas"],
 pattern:"Divide & Conquer",algo:"Modified Merge Sort",tags:["merge-sort"],
 concept:"During merge: when right element placed before left elements, inversions += remaining left count. Counted during merge O(n log n).",
 brute:{tc:"O(n²)",sc:"O(1)",code:`long countInversions(int[] a) {
    long cnt=0;
    for(int i=0;i<a.length;i++) for(int j=i+1;j<a.length;j++) if(a[i]>a[j]) cnt++;
    return cnt;
}`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`long cnt = 0;
long countInversions(int[] arr){cnt=0;mergeSort(arr,0,arr.length-1);return cnt;}
void mergeSort(int[] a, int lo, int hi) {
    if(lo>=hi)return;
    int mid=lo+(hi-lo)/2;
    mergeSort(a,lo,mid); mergeSort(a,mid+1,hi);
    merge(a,lo,mid,hi);
}
void merge(int[] a, int lo, int mid, int hi) {
    int[] L=Arrays.copyOfRange(a,lo,mid+1),R=Arrays.copyOfRange(a,mid+1,hi+1);
    int i=0,j=0,k=lo;
    while(i<L.length && j<R.length) {
        if(L[i]<=R[j]) a[k++]=L[i++];
        else{ a[k++]=R[j++]; cnt+=(L.length-i); } // ALL remaining L form inversions
    }
    while(i<L.length)a[k++]=L[i++];while(j<R.length)a[k++]=R[j++];
}`,note:"When R[j] < L[i], all remaining elements in L are also > R[j] (since L is sorted). Count += remaining L elements."}},

{id:47,num:"LC#493",name:"Reverse Pairs",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver","Coding Ninjas"],
 pattern:"Divide & Conquer",algo:"Modified Merge Sort",tags:["merge-sort","inversions"],
 concept:"Count pairs where nums[i] > 2*nums[j] (i<j). Count step SEPARATE from merge step, both using sorted order.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`int reversePairs(int[] nums) {
    int cnt=0;
    for(int i=0;i<nums.length;i++) for(int j=i+1;j<nums.length;j++) if((long)nums[i]>2L*nums[j]) cnt++;
    return cnt;
}`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`int cnt = 0;
int reversePairs(int[] nums){cnt=0;ms(nums,0,nums.length-1);return cnt;}
void ms(int[] a, int lo, int hi) {
    if(lo>=hi)return; int m=lo+(hi-lo)/2;
    ms(a,lo,m); ms(a,m+1,hi);
    // COUNT step (before merge, both halves sorted)
    int j=m+1;
    for(int i=lo;i<=m;i++){while(j<=hi&&(long)a[i]>2L*a[j])j++;cnt+=j-m-1;}
    // MERGE step (standard)
    merge(a,lo,m,hi);
}`,note:"Count BEFORE merge using two-pointers on sorted halves. 2L×a[j] prevents int overflow."}},

{id:48,num:"LC#198",name:"House Robber",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"DP",algo:"Linear DP",tags:["dp"],
 concept:"dp[i] = max(dp[i-1], dp[i-2]+nums[i]). Roll to O(1) space using two variables.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`// Recursive: rob[i] = max(rob(i-2)+nums[i], rob(i-1))`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int rob(int[] nums) {
    int prev2=0, prev1=0;
    for (int n:nums) {
        int curr = Math.max(prev1, prev2+n); // skip or rob
        prev2=prev1; prev1=curr;
    }
    return prev1;
}`,note:"prev2 = dp[i-2], prev1 = dp[i-1]. Roll forward, no array needed."}},

{id:49,num:"LC#300",name:"Longest Increasing Subsequence (LIS)",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar","Coding Ninjas"],
 pattern:"DP",algo:"Patience Sorting (Binary Search)",tags:["dp","binary-search"],
 concept:"Patience sorting: maintain tails[] of minimum tail values. Binary search for position of each element.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`int lengthOfLIS(int[] nums) {
    int n=nums.length; int[] dp=new int[n]; Arrays.fill(dp,1);
    int max=1;
    for(int i=1;i<n;i++){for(int j=0;j<i;j++)if(nums[j]<nums[i])dp[i]=Math.max(dp[i],dp[j]+1);max=Math.max(max,dp[i]);}
    return max;
}`},
 optimal:{tc:"O(n log n)",sc:"O(n)",code:`int lengthOfLIS(int[] nums) {
    List<Integer> tails = new ArrayList<>();
    for (int n:nums) {
        int lo=0, hi=tails.size();
        while (lo<hi){int m=lo+(hi-lo)/2;if(tails.get(m)<n)lo=m+1;else hi=m;}
        if (lo==tails.size()) tails.add(n); // extend LIS
        else tails.set(lo, n);              // replace — maintain smallest tail
    }
    return tails.size();
}`,note:"tails[] does NOT represent actual LIS. It maintains minimum possible tail for each LIS length."}},

{id:50,num:"LC#416",name:"Partition Equal Subset Sum",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"DP",algo:"0/1 Knapsack",tags:["dp","knapsack"],
 concept:"Find subset with sum = totalSum/2. dp[j] = can we achieve sum j. Iterate backwards to prevent reuse.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`// Try all 2^n subsets`},
 optimal:{tc:"O(n×sum)",sc:"O(sum)",code:`boolean canPartition(int[] nums) {
    int sum=0; for(int n:nums) sum+=n;
    if(sum%2!=0) return false;
    int target=sum/2;
    boolean[] dp = new boolean[target+1];
    dp[0]=true;
    for(int n:nums)
        for(int j=target;j>=n;j--) // BACKWARDS to prevent reuse (0/1 knapsack)
            dp[j]|=dp[j-n];
    return dp[target];
}`,note:"Iterate j BACKWARDS (target→n). Forward iteration would allow using same element multiple times (unbounded knapsack)."}},

/* ══════════════ SECTION 3 — 2D ARRAYS / MATRIX ══════════════ */
{id:51,num:"LC#48",name:"Rotate Matrix 90° Clockwise",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Matrix",algo:"Transpose + Reverse Rows",tags:["matrix","in-place"],
 concept:"Step1: Transpose (swap [i][j] ↔ [j][i]). Step2: Reverse each row. Result = 90° CW rotation. O(1) space.",
 brute:{tc:"O(n²)",sc:"O(n²)",code:`// Copy to new matrix: result[j][n-1-i] = matrix[i][j]`},
 optimal:{tc:"O(n²)",sc:"O(1)",code:`void rotate(int[][] matrix) {
    int n = matrix.length;
    // Step 1: Transpose (swap across main diagonal)
    for(int i=0;i<n;i++)
        for(int j=i+1;j<n;j++){int t=matrix[i][j];matrix[i][j]=matrix[j][i];matrix[j][i]=t;}
    // Step 2: Reverse each row
    for(int[] row:matrix){
        int lo=0,hi=row.length-1;
        while(lo<hi){int t=row[lo];row[lo++]=row[hi];row[hi--]=t;}
    }
}
// For 90° CCW: reverse each row FIRST, then transpose`,note:"For 180°: transpose twice or flip horizontally then vertically."}},

{id:52,num:"LC#54",name:"Spiral Matrix (Print)",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Matrix",algo:"Layer Peeling / Boundary Simulation",tags:["matrix","simulation"],
 concept:"Maintain top/bottom/left/right boundaries. Traverse → right, ↓ down, ← left, ↑ up. Shrink boundary after each direction. Check bounds before left/up traversal.",
 brute:{tc:"O(mn)",sc:"O(mn)",code:`// Visited array approach — O(mn) extra space`},
 optimal:{tc:"O(mn)",sc:"O(1)",code:`List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> res = new ArrayList<>();
    int top=0, bot=matrix.length-1, left=0, right=matrix[0].length-1;
    while(top<=bot && left<=right) {
        for(int i=left;i<=right;i++) res.add(matrix[top][i]); top++;
        for(int i=top;i<=bot;i++) res.add(matrix[i][right]); right--;
        if(top<=bot){for(int i=right;i>=left;i--) res.add(matrix[bot][i]);bot--;}
        if(left<=right){for(int i=bot;i>=top;i--) res.add(matrix[i][left]);left++;}
    }
    return res;
}`,note:"Check top<=bot and left<=right BEFORE bottom/left traversals to avoid duplicates in single row/col cases."}},

{id:53,num:"LC#59",name:"Spiral Matrix II (Generate)",cat:"2D Array",difficulty:"Medium",
 sheets:["LeetCode","Striver"],
 pattern:"Matrix",algo:"Layer Filling / Simulation",tags:["matrix","simulation"],
 concept:"Fill numbers 1..n² in spiral order. Same boundary approach as Spiral Matrix I but filling instead of reading.",
 brute:{tc:"O(n²)",sc:"O(n²)",code:`// Only approach — must fill O(n²) cells`},
 optimal:{tc:"O(n²)",sc:"O(n²)",code:`int[][] generateMatrix(int n) {
    int[][] matrix = new int[n][n];
    int top=0,bot=n-1,left=0,right=n-1,num=1;
    while(top<=bot && left<=right){
        for(int i=left;i<=right;i++) matrix[top][i]=num++;  top++;
        for(int i=top;i<=bot;i++)   matrix[i][right]=num++; right--;
        if(top<=bot){for(int i=right;i>=left;i--) matrix[bot][i]=num++;bot--;}
        if(left<=right){for(int i=bot;i>=top;i--) matrix[i][left]=num++;left++;}
    }
    return matrix;
}`,note:"Exact same boundary logic as Spiral Matrix I but writing num++ instead of reading."}},

{id:54,num:"LC#73",name:"Set Matrix Zeroes",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Matrix",algo:"First Row/Col as Markers",tags:["matrix","in-place"],
 concept:"Use first row and first col as markers. BUT first handle whether first row/col themselves have zeros (separate booleans).",
 brute:{tc:"O(mn)",sc:"O(m+n)",code:`// Extra sets for zero rows/cols — O(m+n) space`},
 optimal:{tc:"O(mn)",sc:"O(1)",code:`void setZeroes(int[][] m) {
    int R=m.length, C=m[0].length;
    boolean firstRow=false, firstCol=false;
    for(int j=0;j<C;j++) if(m[0][j]==0) firstRow=true;
    for(int i=0;i<R;i++) if(m[i][0]==0) firstCol=true;
    // Mark zeros in first row/col
    for(int i=1;i<R;i++) for(int j=1;j<C;j++) if(m[i][j]==0){m[i][0]=0;m[0][j]=0;}
    // Zero out based on markers
    for(int i=1;i<R;i++) for(int j=1;j<C;j++) if(m[i][0]==0||m[0][j]==0) m[i][j]=0;
    if(firstRow) Arrays.fill(m[0],0);
    if(firstCol) for(int i=0;i<R;i++) m[i][0]=0;
}`,note:"Two separate booleans track whether first row/col had zeros before we use them as markers."}},

{id:55,num:"LC#74",name:"Search a 2D Matrix (Sorted rows, first > last prev row)",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Binary Search",algo:"Binary Search on Flattened Matrix",tags:["binary-search","matrix"],
 concept:"Treat whole matrix as sorted 1D array. mid/cols = row, mid%cols = col. Standard binary search.",
 brute:{tc:"O(mn)",sc:"O(1)",code:`// Linear scan — O(mn)`},
 optimal:{tc:"O(log(mn))",sc:"O(1)",code:`boolean searchMatrix(int[][] m, int target) {
    int r=m.length, c=m[0].length;
    int lo=0, hi=r*c-1;
    while(lo<=hi) {
        int mid=lo+(hi-lo)/2;
        int val=m[mid/c][mid%c]; // 1D index to 2D
        if(val==target) return true;
        if(val<target) lo=mid+1; else hi=mid-1;
    }
    return false;
}`,note:"mid/c gives row, mid%c gives column. This ONLY works when rows are sorted AND each row's first element > previous row's last."}},

{id:56,num:"LC#240",name:"Search a 2D Matrix II (Rows and cols sorted)",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Matrix",algo:"Top-Right Corner Strategy",tags:["matrix","two-pointer"],
 concept:"Start top-right. If current > target → move left (eliminate column). If current < target → move down (eliminate row).",
 brute:{tc:"O(mn)",sc:"O(1)",code:`// Check each element — O(mn)`},
 optimal:{tc:"O(m+n)",sc:"O(1)",code:`boolean searchMatrixII(int[][] m, int target) {
    int r=0, c=m[0].length-1; // START at top-right corner
    while(r<m.length && c>=0) {
        if(m[r][c]==target) return true;
        if(m[r][c]>target) c--;  // too big → eliminate this column
        else r++;                 // too small → eliminate this row
    }
    return false;
}`,note:"Top-right: bigger than all in its row (→ can eliminate row if too small), smaller than all below (→ can eliminate col if too big)."}},

{id:57,num:"LC#85",name:"Maximal Rectangle in Binary Matrix",cat:"2D Array",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Monotonic Stack",algo:"Histogram per Row + Monotonic Stack",tags:["stack","monotonic","matrix","dp"],
 concept:"Build histogram row-by-row (heights[j] += 1 if '1', reset to 0 if '0'). Apply Largest Rectangle in Histogram on each row.",
 brute:{tc:"O(m²n²)",sc:"O(1)",code:`// Try all O(m²n²) submatrices — too slow`},
 optimal:{tc:"O(mn)",sc:"O(n)",code:`int maximalRectangle(char[][] matrix) {
    if(matrix.length==0) return 0;
    int n=matrix[0].length, max=0;
    int[] heights=new int[n];
    for(char[] row:matrix) {
        for(int j=0;j<n;j++)
            heights[j]=row[j]=='0'?0:heights[j]+1; // build histogram
        max=Math.max(max,largestRectangle(heights));
    }
    return max;
}
int largestRectangle(int[] h){
    Deque<Integer>st=new ArrayDeque<>();int max=0,n=h.length;
    for(int i=0;i<=n;i++){int cur=i==n?0:h[i];while(!st.isEmpty()&&cur<h[st.peek()]){int t=st.pop();int w=st.isEmpty()?i:i-st.peek()-1;max=Math.max(max,h[t]*w);}st.push(i);}
    return max;
}`,note:"Reduce to histogram problem. If cell is '0', height resets to 0 (no continuous 1s above)."}},

{id:58,num:"LC#498",name:"Diagonal Traverse",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"Direction Simulation",tags:["matrix","simulation"],
 concept:"(r+c)%2 determines direction. Even: go up-right. Odd: go down-left. Handle boundaries carefully for each direction.",
 brute:{tc:"O(mn)",sc:"O(mn)",code:`// Collect diagonals by r+c index, alternate reversal`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int[] findDiagonalOrder(int[][] mat) {
    int m=mat.length,n=mat[0].length;
    int[] res=new int[m*n]; int r=0,c=0;
    for(int i=0;i<m*n;i++){
        res[i]=mat[r][c];
        if((r+c)%2==0){ // going up-right
            if(c==n-1)r++;
            else if(r==0)c++;
            else{r--;c++;}
        } else { // going down-left
            if(r==m-1)c++;
            else if(c==0)r++;
            else{r++;c--;}
        }
    }
    return res;
}`,note:"Handle boundary BEFORE general movement. Check right/top boundaries before r--,c++."}},

{id:59,num:"LC#1706",name:"Where Will the Ball Fall",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"Simulation",tags:["matrix","simulation"],
 concept:"Simulate ball path. At each row: +1=deflect right, -1=deflect left. Check V-shape (stuck) when grid[r][c] != grid[r][c+1 or c-1].",
 brute:{tc:"O(mn)",sc:"O(n)",code:`// Simulate each ball separately — already optimal`},
 optimal:{tc:"O(mn)",sc:"O(n)",code:`int[] findBall(int[][] grid) {
    int m=grid.length, n=grid[0].length;
    int[] res=new int[n];
    for(int col=0;col<n;col++){
        int c=col;
        for(int r=0;r<m;r++){
            int next=c+grid[r][c]; // next column
            if(next<0||next>=n||grid[r][c]!=grid[r][next]){c=-1;break;} // stuck
            c=next;
        }
        res[col]=c;
    }
    return res;
}`,note:"V-shape check: if grid[r][c] != grid[r][next] they form a V → ball stuck. grid[r][c]!=grid[r][next] means opposite deflections."}},

{id:60,num:"LC#419",name:"Battleships in a Board",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"Count Top-Left Corners",tags:["matrix"],
 concept:"Only count 'X' that are not preceded by 'X' above or left (top-left corner of each battleship). O(1) space.",
 brute:{tc:"O(mn)",sc:"O(mn)",code:`// BFS/DFS to mark entire battleship — O(mn) space`},
 optimal:{tc:"O(mn)",sc:"O(1)",code:`int countBattleships(char[][] board) {
    int count=0;
    for(int i=0;i<board.length;i++)
        for(int j=0;j<board[0].length;j++)
            if(board[i][j]=='X' &&
               (i==0||board[i-1][j]!=  'X') && // no X above
               (j==0||board[i][j-1]!='X'))     // no X to left
                count++; // this is top-left corner
    return count;
}`,note:"Top-left corner: 'X' with no 'X' directly above or directly left. Each battleship has exactly one such corner."}},

{id:61,num:"LC#2133",name:"Check if Every Row and Column Contains All Numbers",cat:"2D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"Frequency Count",tags:["matrix","hashset"],
 concept:"For each row and column, use a bitset or boolean array to check if all n values [1..n] present.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// Check each row and column separately`},
 optimal:{tc:"O(n²)",sc:"O(n)",code:`boolean checkValid(int[][] matrix) {
    int n=matrix.length;
    for(int i=0;i<n;i++){
        boolean[] rowSeen=new boolean[n+1];
        boolean[] colSeen=new boolean[n+1];
        for(int j=0;j<n;j++){
            if(rowSeen[matrix[i][j]]||colSeen[matrix[j][i]]) return false;
            rowSeen[matrix[i][j]]=true;
            colSeen[matrix[j][i]]=true;
        }
    }
    return true;
}`,note:"Process row i and column i simultaneously in same inner loop — elegant O(n²) single pass."}},

{id:62,num:"LC#289",name:"Game of Life",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Matrix",algo:"In-place Bit Encoding",tags:["matrix","simulation"],
 concept:"Encode next state in 2nd bit (bit1=current, bit2=next). Two-pass: encode transitions, then shift right.",
 brute:{tc:"O(mn)",sc:"O(mn)",code:`// Copy board, update from copy — O(mn) space`},
 optimal:{tc:"O(mn)",sc:"O(1)",code:`void gameOfLife(int[][] b) {
    int R=b.length,C=b[0].length;
    int[] dr={-1,-1,-1,0,0,1,1,1},dc={-1,0,1,-1,1,-1,0,1};
    for(int i=0;i<R;i++) for(int j=0;j<C;j++){
        int live=0;
        for(int k=0;k<8;k++){int r=i+dr[k],c=j+dc[k];if(r>=0&&r<R&&c>=0&&c<C&&(b[r][c]&1)==1)live++;}
        // Apply rules using 2nd bit for next state
        if((b[i][j]&1)==1&&(live==2||live==3)) b[i][j]|=2; // live→live
        if((b[i][j]&1)==0&&live==3) b[i][j]|=2;            // dead→live
    }
    for(int i=0;i<R;i++) for(int j=0;j<C;j++) b[i][j]>>=1; // shift to get next state
}`,note:"(b[r][c]&1) reads current state. Bit OR 2 sets future state. Final right shift extracts future as current."}},

{id:63,num:"LC#2352",name:"Equal Row and Column Pairs",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"HashMap",algo:"HashMap of Row/Col Signatures",tags:["matrix","hashmap"],
 concept:"Convert each row to string key, count in map. For each column, generate string key, look up in map.",
 brute:{tc:"O(n³)",sc:"O(1)",code:`// Compare every row with every column — O(n³)`},
 optimal:{tc:"O(n²)",sc:"O(n²)",code:`int equalPairs(int[][] grid) {
    int n=grid.length;
    Map<String,Integer> rowCount=new HashMap<>();
    for(int[] row:grid){
        String key=Arrays.toString(row);
        rowCount.merge(key,1,Integer::sum);
    }
    int count=0;
    for(int j=0;j<n;j++){
        int[] col=new int[n];
        for(int i=0;i<n;i++) col[i]=grid[i][j];
        count+=rowCount.getOrDefault(Arrays.toString(col),0);
    }
    return count;
}`,note:"Arrays.toString() creates consistent string key for array comparison. Column extraction requires building int[] first."}},

{id:64,num:"LC#1572",name:"Matrix Diagonal Sum",cat:"2D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"Direct Traversal",tags:["matrix"],
 concept:"Primary diagonal: grid[i][i]. Secondary diagonal: grid[i][n-1-i]. If n is odd, center cell counted twice — subtract once.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`// Sum all elements and check diagonal condition`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int diagonalSum(int[][] mat) {
    int n=mat.length, sum=0;
    for(int i=0;i<n;i++){
        sum+=mat[i][i];         // primary diagonal
        sum+=mat[i][n-1-i];     // secondary diagonal
    }
    if(n%2==1) sum-=mat[n/2][n/2]; // center counted twice if odd
    return sum;
}`,note:"O(n) not O(n²). Only diagonal elements needed."}},

{id:65,num:"LC#36",name:"Valid Sudoku",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"3×3 Box Index Trick",tags:["matrix","hashset"],
 concept:"Check each row, column, and 3×3 box for duplicates. Box index = (row/3)*3 + col/3.",
 brute:{tc:"O(81)=O(1)",sc:"O(81)",code:`// 81 cells fixed — always O(1)`},
 optimal:{tc:"O(1)",sc:"O(1)",code:`boolean isValidSudoku(char[][] board) {
    Set<String> seen=new HashSet<>();
    for(int i=0;i<9;i++) for(int j=0;j<9;j++){
        char c=board[i][j];
        if(c=='.') continue;
        String row="R"+i+c, col="C"+j+c, box="B"+(i/3)+(j/3)+c;
        if(!seen.add(row)||!seen.add(col)||!seen.add(box)) return false;
    }
    return true;
}`,note:"Box index: (i/3)*3+(j/3) maps each cell to its 3×3 box (0-8). String encoding prevents false collisions."}},

{id:66,num:"LC#1351",name:"Count Negative Numbers in Sorted Matrix",cat:"2D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Binary Search",algo:"Binary Search per Row / Staircase",tags:["binary-search","matrix"],
 concept:"Start top-right. If negative: all elements below are also negative (count += rows remaining), move left. Else move down.",
 brute:{tc:"O(mn)",sc:"O(1)",code:`// Scan all elements — O(mn)`},
 optimal:{tc:"O(m+n)",sc:"O(1)",code:`int countNegatives(int[][] grid) {
    int m=grid.length, n=grid[0].length;
    int r=0, c=n-1, count=0;
    while(r<m && c>=0){
        if(grid[r][c]<0){
            count+=m-r; // all rows from r down have negative at col c
            c--;
        } else r++;
    }
    return count;
}`,note:"Staircase approach: rows sorted desc, cols sorted desc. top-right corner eliminates row or column at each step."}},

{id:67,num:"LC#2482",name:"Rows and Columns With Maximum Size",cat:"2D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"Row/Column Sum",tags:["matrix"],
 concept:"Count ones in each row and column. Find max. Return indices with that max count.",
 brute:{tc:"O(mn)",sc:"O(m+n)",code:`// Already optimal for this problem`},
 optimal:{tc:"O(mn)",sc:"O(m+n)",code:`List<List<Integer>> rowAndColumnPairs(int[][] grid) {
    int m=grid.length,n=grid[0].length;
    int[] rowMax=new int[m], colMax=new int[n];
    for(int i=0;i<m;i++) for(int j=0;j<n;j++){rowMax[i]+=grid[i][j];colMax[j]+=grid[i][j];}
    int maxR=Arrays.stream(rowMax).max().getAsInt();
    int maxC=Arrays.stream(colMax).max().getAsInt();
    List<List<Integer>> res=new ArrayList<>();
    if(maxR==maxC){
        List<Integer> rows=new ArrayList<>(),cols=new ArrayList<>();
        for(int i=0;i<m;i++) if(rowMax[i]==maxR) rows.add(i);
        for(int j=0;j<n;j++) if(colMax[j]==maxC) cols.add(j);
        res.add(rows); res.add(cols);
    }
    return res;
}`,note:"Compute sums first, then find max, then collect indices meeting max."}},

{id:68,num:"LC#2614",name:"Prime In Diagonal",cat:"2D Array",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"Diagonal Traversal + Sieve",tags:["matrix","math"],
 concept:"Check both diagonals for prime numbers. Use trial division or precompute Sieve of Eratosthenes.",
 brute:{tc:"O(n×√max)",sc:"O(1)",code:`// Check primality of each diagonal element`},
 optimal:{tc:"O(n×√max)",sc:"O(1)",code:`int diagonalPrime(int[][] nums) {
    int n=nums.length, max=0;
    for(int i=0;i<n;i++){
        if(isPrime(nums[i][i])) max=Math.max(max,nums[i][i]);
        if(isPrime(nums[i][n-1-i])) max=Math.max(max,nums[i][n-1-i]);
    }
    return max;
}
boolean isPrime(int n){
    if(n<2) return false;
    for(int i=2;(long)i*i<=n;i++) if(n%i==0) return false;
    return true;
}`,note:"Both diagonals in single pass. Corner element (when n is odd) checked twice but doesn't affect max."}},

{id:69,num:"LC#2661",name:"First Completely Painted Row or Column",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Matrix",algo:"HashMap + Row/Col Counter",tags:["matrix","hashmap"],
 concept:"Map each value to its (row,col). Track row/col paint counts. When row count = cols or col count = rows → fully painted.",
 brute:{tc:"O(mn×(m+n))",sc:"O(mn)",code:`// For each painted cell, check if row/col complete — O(mn×(m+n))`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int firstCompleteIndex(int[] arr, int[][] mat) {
    int m=mat.length,n=mat[0].length;
    Map<Integer,int[]> pos=new HashMap<>();
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) pos.put(mat[i][j],new int[]{i,j});
    int[] rowCnt=new int[m], colCnt=new int[n];
    for(int k=0;k<arr.length;k++){
        int[] rc=pos.get(arr[k]);
        int r=rc[0],c=rc[1];
        if(++rowCnt[r]==n||++colCnt[c]==m) return k;
    }
    return -1;
}`,note:"Pre-map values to positions for O(1) lookup. Increment counters and check completion eagerly."}},

{id:70,num:"LC#695",name:"Max Area of Island",cat:"2D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"BFS/DFS",algo:"DFS Flood Fill",tags:["matrix","dfs","graph"],
 concept:"DFS from each '1' cell. Mark visited by setting to 0. Return max area across all islands.",
 brute:{tc:"O(mn)",sc:"O(mn)",code:`// BFS alternative uses queue`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int maxAreaOfIsland(int[][] grid) {
    int m=grid.length,n=grid[0].length,max=0;
    for(int i=0;i<m;i++) for(int j=0;j<n;j++)
        if(grid[i][j]==1) max=Math.max(max,dfs(grid,i,j));
    return max;
}
int dfs(int[][] g, int i, int j){
    if(i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]==0) return 0;
    g[i][j]=0; // mark visited
    return 1+dfs(g,i+1,j)+dfs(g,i-1,j)+dfs(g,i,j+1)+dfs(g,i,j-1);
}`,note:"Modifying input to mark visited avoids extra visited array. Restore if needed: pass original 1 as parameter."}},

/* ══════════════ SECTION 4 — STRING PROBLEMS ══════════════ */
{id:71,num:"LC#125",name:"Valid Palindrome",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Two Pointer on String",tags:["two-pointer","string"],
 concept:"Two pointers from both ends. Skip non-alphanumeric. Compare chars case-insensitively. Stop when pointers meet.",
 brute:{tc:"O(n)",sc:"O(n)",code:`// Clean string, reverse, compare`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean isPalindrome(String s) {
    int lo=0, hi=s.length()-1;
    while(lo<hi){
        while(lo<hi&&!Character.isLetterOrDigit(s.charAt(lo))) lo++;
        while(lo<hi&&!Character.isLetterOrDigit(s.charAt(hi))) hi--;
        if(Character.toLowerCase(s.charAt(lo))!=Character.toLowerCase(s.charAt(hi))) return false;
        lo++; hi--;
    }
    return true;
}`,note:"Character.isLetterOrDigit() handles all alphanumeric. toLowerCase() for case-insensitive comparison."}},

{id:72,num:"LC#242",name:"Valid Anagram",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"HashMap",algo:"Frequency Array",tags:["hashmap","string"],
 concept:"Count char frequencies. Increment for s, decrement for t. Any non-zero means not anagram.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`// Sort both strings, compare`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean isAnagram(String s, String t) {
    if(s.length()!=t.length()) return false;
    int[] freq=new int[26];
    for(char c:s.toCharArray()) freq[c-'a']++;
    for(char c:t.toCharArray()) freq[c-'a']--;
    for(int f:freq) if(f!=0) return false;
    return true;
}`,note:"O(1) space since freq array always size 26. For Unicode: use HashMap instead."}},

{id:73,num:"LC#387",name:"First Unique Character in String",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"HashMap",algo:"Two-Pass Frequency",tags:["hashmap","string"],
 concept:"Pass 1: count frequencies. Pass 2: return first char with frequency 1.",
 brute:{tc:"O(n²)",sc:"O(1)",code:`// For each char, scan rest for duplicates`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int firstUniqChar(String s) {
    int[] freq=new int[26];
    for(char c:s.toCharArray()) freq[c-'a']++;
    for(int i=0;i<s.length();i++)
        if(freq[s.charAt(i)-'a']==1) return i;
    return -1;
}`,note:"Two passes with O(1) space. First pass counts, second pass finds first with count 1."}},

{id:74,num:"LC#20",name:"Valid Parentheses",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Monotonic Stack",algo:"Stack",tags:["stack","string"],
 concept:"Push opening brackets. On closing bracket: if stack empty or top doesn't match → invalid. Stack empty at end → valid.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// Repeatedly remove matching pairs until no change`},
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

{id:75,num:"LC#14",name:"Longest Common Prefix",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"String",algo:"Horizontal Scanning",tags:["string"],
 concept:"Start with first string as prefix. Shrink prefix until all strings start with it.",
 brute:{tc:"O(n×m)",sc:"O(m)",code:`// Sort, compare first and last`},
 optimal:{tc:"O(n×m)",sc:"O(1)",code:`String longestCommonPrefix(String[] strs) {
    String prefix=strs[0];
    for(int i=1;i<strs.length;i++)
        while(!strs[i].startsWith(prefix))
            prefix=prefix.substring(0,prefix.length()-1);
    return prefix;
}`,note:"startsWith() is O(m). Worst case O(n×m) same as vertical scan but simpler to implement."}},

{id:76,num:"LC#151",name:"Reverse Words in a String",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Two Pointer / Split & Join",tags:["two-pointer","string"],
 concept:"Trim, split on whitespace regex, reverse array, join. Or: reverse whole string, reverse each word.",
 brute:{tc:"O(n)",sc:"O(n)",code:`return String.join(" ", s.trim().split("\\\\s+"));  // too easy`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`String reverseWords(String s) {
    String[] words=s.trim().split("\\s+"); // split on any whitespace
    StringBuilder sb=new StringBuilder();
    for(int i=words.length-1;i>=0;i--){
        sb.append(words[i]);
        if(i>0) sb.append(" ");
    }
    return sb.toString();
}
// In-place O(1) extra space (char array):
// 1. Reverse entire string
// 2. Reverse each word
// 3. Trim leading/trailing spaces`,note:"\\\\s+ handles multiple consecutive spaces. String.split() with \\\\s+ is cleaner."}},

{id:77,num:"LC#567",name:"Permutation in String",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Sliding Window",algo:"Fixed Window Frequency",tags:["sliding-window","string"],
 concept:"Fixed window of s1.length(). Compare frequency arrays. Slide: add right char, remove left char. Arrays.equals is O(26)=O(1).",
 brute:{tc:"O(n·m!)",sc:"O(m)",code:`// Generate all permutations of s1, check if any is substring`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean checkInclusion(String s1, String s2) {
    if(s1.length()>s2.length()) return false;
    int[] c1=new int[26],c2=new int[26],k=s1.length();
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

{id:78,num:"LC#49",name:"Group Anagrams",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"HashMap",algo:"Sort Key / Frequency Key",tags:["hashmap","string"],
 concept:"Key = sorted string. All anagrams → same sorted form. HashMap groups by key.",
 brute:{tc:"O(n²×m log m)",sc:"O(n×m)",code:`// Check each pair if anagram`},
 optimal:{tc:"O(n×m log m)",sc:"O(n×m)",code:`List<List<String>> groupAnagrams(String[] strs) {
    Map<String,List<String>> map=new HashMap<>();
    for(String s:strs){
        char[] c=s.toCharArray(); Arrays.sort(c);
        String key=new String(c);
        map.computeIfAbsent(key,k->new ArrayList<>()).add(s);
    }
    return new ArrayList<>(map.values());
}
// O(nm) alternative key: char frequency string "a2b1c3..."`,note:"Sorted string is canonical. Alternative: frequency-based key avoids sort → O(nm) time."}},

{id:79,num:"LC#5",name:"Longest Palindromic Substring",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"Two Pointer",algo:"Expand Around Center",tags:["two-pointer","string","dp"],
 concept:"For each center (n centers for odd, n-1 for even), expand while palindrome. Track max. O(n²) time O(1) space.",
 brute:{tc:"O(n³)",sc:"O(1)",code:`// Check every substring if palindrome — O(n³)`},
 optimal:{tc:"O(n²)",sc:"O(1)",code:`String longestPalindrome(String s) {
    int start=0,maxLen=1;
    for(int i=0;i<s.length();i++){
        int odd=expand(s,i,i);    // odd length
        int even=expand(s,i,i+1); // even length
        int len=Math.max(odd,even);
        if(len>maxLen){maxLen=len;start=i-(len-1)/2;}
    }
    return s.substring(start,start+maxLen);
}
int expand(String s,int lo,int hi){
    while(lo>=0&&hi<s.length()&&s.charAt(lo)==s.charAt(hi)){lo--;hi++;}
    return hi-lo-1; // length of palindrome
}`,note:"2n-1 centers (n odd + n-1 even). Manacher's algo is O(n) but rarely needed in interviews."}},

{id:80,num:"LC#647",name:"Palindromic Substrings",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Expand Around Center",tags:["two-pointer","string"],
 concept:"Same expand-around-center. Count all valid palindromes instead of tracking longest.",
 brute:{tc:"O(n³)",sc:"O(1)",code:`// Check every substring — O(n³)`},
 optimal:{tc:"O(n²)",sc:"O(1)",code:`int countSubstrings(String s) {
    int count=0;
    for(int i=0;i<s.length();i++){
        count+=expandCount(s,i,i);    // odd
        count+=expandCount(s,i,i+1);  // even
    }
    return count;
}
int expandCount(String s,int lo,int hi){
    int cnt=0;
    while(lo>=0&&hi<s.length()&&s.charAt(lo)==s.charAt(hi)){cnt++;lo--;hi++;}
    return cnt;
}`,note:"Each expansion yields one palindrome. Count includes single chars (base case)."}},

{id:81,num:"LC#8",name:"String to Integer (atoi)",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"String",algo:"State Machine / Linear Scan",tags:["string","math"],
 concept:"Skip whitespace, handle sign, read digits until non-digit. Clamp to [INT_MIN, INT_MAX] to handle overflow.",
 brute:{tc:"O(n)",sc:"O(1)",code:`// No simpler approach`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int myAtoi(String s) {
    int i=0,n=s.length(),sign=1;
    long result=0;
    while(i<n&&s.charAt(i)==' ') i++; // skip whitespace
    if(i<n&&(s.charAt(i)=='+'||s.charAt(i)=='-'))
        sign=(s.charAt(i++)=='-')?-1:1;
    while(i<n&&Character.isDigit(s.charAt(i))){
        result=result*10+(s.charAt(i++)-'0');
        if(result*sign>Integer.MAX_VALUE) return Integer.MAX_VALUE;
        if(result*sign<Integer.MIN_VALUE) return Integer.MIN_VALUE;
    }
    return (int)(result*sign);
}`,note:"Use long for intermediate result to detect overflow before clamping to int range."}},

{id:82,num:"LC#28",name:"Find the Index of the First Occurrence (strStr)",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"String",algo:"KMP / indexOf",tags:["string","kmp"],
 concept:"KMP: build failure function (partial match table), then scan. O(n+m). Or Java's indexOf is O(nm) but acceptable.",
 brute:{tc:"O(nm)",sc:"O(1)",code:`int strStr(String haystack, String needle) {
    for(int i=0;i<=haystack.length()-needle.length();i++)
        if(haystack.substring(i,i+needle.length()).equals(needle)) return i;
    return -1;
}`},
 optimal:{tc:"O(n+m)",sc:"O(m)",code:`int strStr(String text, String pat) {
    if(pat.isEmpty()) return 0;
    // Build KMP failure function
    int m=pat.length(); int[] lps=new int[m];
    for(int i=1,j=0;i<m;){
        if(pat.charAt(i)==pat.charAt(j)){lps[i++]=++j;}
        else if(j>0)j=lps[j-1];else i++;
    }
    // KMP search
    for(int i=0,j=0;i<text.length();){
        if(text.charAt(i)==pat.charAt(j)){i++;j++;}
        if(j==m) return i-j; // found!
        else if(i<text.length()&&text.charAt(i)!=pat.charAt(j))
            j=(j>0)?lps[j-1]:0;
    }
    return -1;
}`,note:"LPS (Longest Proper Prefix Suffix) allows skipping recomparisons. Critical for O(n+m) guarantee."}},

{id:83,num:"LC#1143",name:"Longest Common Subsequence",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"DP",algo:"2D DP Table",tags:["dp","string"],
 concept:"dp[i][j] = LCS of text1[0..i-1] and text2[0..j-1]. If chars match: dp[i][j]=dp[i-1][j-1]+1. Else: max of both skip options.",
 brute:{tc:"O(2^(m+n))",sc:"O(m+n)",code:`// Recursive without memoization`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int longestCommonSubsequence(String t1, String t2) {
    int m=t1.length(),n=t2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
        if(t1.charAt(i-1)==t2.charAt(j-1))
            dp[i][j]=dp[i-1][j-1]+1;      // chars match
        else
            dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]); // skip one char
    }
    return dp[m][n];
}
// O(n) space: use two 1D arrays (prev and curr rows)`,note:"Space optimizable to O(min(m,n)) using two rows. LCS is foundation for diff, edit distance, etc."}},

{id:84,num:"LC#72",name:"Edit Distance (Levenshtein)",cat:"String",difficulty:"Hard",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"DP",algo:"2D DP Table",tags:["dp","string"],
 concept:"dp[i][j] = min ops to convert word1[0..i-1] to word2[0..j-1]. 3 operations: insert, delete, replace.",
 brute:{tc:"O(3^(m+n))",sc:"O(m+n)",code:`// Recursive — exponential`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`int minDistance(String w1, String w2) {
    int m=w1.length(),n=w2.length();
    int[][] dp=new int[m+1][n+1];
    for(int i=0;i<=m;i++) dp[i][0]=i; // delete all of w1
    for(int j=0;j<=n;j++) dp[0][j]=j; // insert all of w2
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
        if(w1.charAt(i-1)==w2.charAt(j-1))
            dp[i][j]=dp[i-1][j-1];
        else
            dp[i][j]=1+Math.min(dp[i-1][j-1], // replace
                        Math.min(dp[i-1][j],   // delete
                                 dp[i][j-1])); // insert
    }
    return dp[m][n];
}`,note:"Base cases: dp[i][0]=i (delete i chars), dp[0][j]=j (insert j chars). Both sides empty = 0 ops."}},

{id:85,num:"LC#10",name:"Regular Expression Matching",cat:"String",difficulty:"Hard",
 sheets:["Amazon","LeetCode"],
 pattern:"DP",algo:"2D DP",tags:["dp","string","regex"],
 concept:"dp[i][j] = does s[0..i-1] match p[0..j-1]. Tricky: '*' can mean 0 occurrences (skip pattern[j-2] and *) or 1+ (reduce s).",
 brute:{tc:"O(2^(m+n))",sc:"O(m+n)",code:`// Recursive without memoization`},
 optimal:{tc:"O(mn)",sc:"O(mn)",code:`boolean isMatch(String s, String p) {
    int m=s.length(),n=p.length();
    boolean[][] dp=new boolean[m+1][n+1];
    dp[0][0]=true;
    // Handle patterns like a*, a*b*, a*b*c* matching empty string
    for(int j=2;j<=n;j++) if(p.charAt(j-1)=='*') dp[0][j]=dp[0][j-2];
    for(int i=1;i<=m;i++) for(int j=1;j<=n;j++){
        char pc=p.charAt(j-1);
        if(pc=='*'){
            dp[i][j]=dp[i][j-2]; // zero occurrences of preceding element
            if(p.charAt(j-2)==s.charAt(i-1)||p.charAt(j-2)=='.')
                dp[i][j]|=dp[i-1][j]; // one+ occurrences
        } else if(pc=='.'||pc==s.charAt(i-1)){
            dp[i][j]=dp[i-1][j-1];
        }
    }
    return dp[m][n];
}`,note:"* case: (1) skip it (0 occurrences) = dp[i][j-2], (2) use it (1+ occurrences) = dp[i-1][j] if preceding char matches."}},

{id:86,num:"LC#139",name:"Word Break",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Love Babbar"],
 pattern:"DP",algo:"DP with Hash Set",tags:["dp","string","hashset"],
 concept:"dp[i] = can s[0..i-1] be segmented. For each i: check all j<i where dp[j] true and s[j..i-1] in dictionary.",
 brute:{tc:"O(2^n)",sc:"O(n)",code:`// Recursive without memoization`},
 optimal:{tc:"O(n²×m)",sc:"O(n)",code:`boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict=new HashSet<>(wordDict);
    int n=s.length();
    boolean[] dp=new boolean[n+1];
    dp[0]=true; // empty string is valid
    for(int i=1;i<=n;i++)
        for(int j=0;j<i;j++)
            if(dp[j] && dict.contains(s.substring(j,i))){dp[i]=true;break;}
    return dp[n];
}`,note:"Break early (break) when dp[i] found true. dict.contains is O(word_len) with hashing."}},

{id:87,num:"LC#791",name:"Custom Sort String",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Sorting",algo:"Custom Comparator",tags:["sorting","string"],
 concept:"Build order map from 'order' string. Sort 's' using custom comparator based on that order. Chars not in order go last.",
 brute:{tc:"O(n log n)",sc:"O(1)",code:`// Sort with lambda comparator — already optimal`},
 optimal:{tc:"O(n+k)",sc:"O(1)",code:`String customSortString(String order, String s) {
    int[] rank=new int[26];
    for(int i=0;i<order.length();i++) rank[order.charAt(i)-'a']=i+1;
    Character[] chars=new Character[s.length()];
    for(int i=0;i<s.length();i++) chars[i]=s.charAt(i);
    Arrays.sort(chars,(a,b)->rank[a-'a']-rank[b-'a']);
    StringBuilder sb=new StringBuilder();
    for(char c:chars) sb.append(c);
    return sb.toString();
}`,note:"rank[c]=0 means c not in order (default), effectively placed at front. Use rank[a]-rank[b] comparator."}},

{id:88,num:"LC#58",name:"Length of Last Word",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"String",algo:"Linear Scan from End",tags:["string"],
 concept:"Scan from end: skip trailing spaces, then count non-space characters.",
 brute:{tc:"O(n)",sc:"O(n)",code:`return s.trim().split(" ")[s.trim().split(" ").length-1].length();`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int lengthOfLastWord(String s) {
    int i=s.length()-1, len=0;
    while(i>=0&&s.charAt(i)==' ') i--; // skip trailing spaces
    while(i>=0&&s.charAt(i)!=' '){len++;i--;} // count last word
    return len;
}`,note:"Scan backwards: skip spaces, count non-spaces. O(1) extra space vs creating new strings."}},

{id:89,num:"LC#443",name:"String Compression",cat:"String",difficulty:"Medium",
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
        if(count>1){
            String cnt=String.valueOf(count);
            for(char d:cnt.toCharArray()) chars[write++]=d;
        }
    }
    return write;
}`,note:"Write digits of count individually (e.g., 12 → '1','2'). Pointer write always <= read pointer i."}},

{id:90,num:"LC#344",name:"Reverse String",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Two Pointer",tags:["two-pointer","string"],
 concept:"Swap chars at lo and hi pointers, move inward. Standard two-pointer reversal.",
 brute:{tc:"O(n)",sc:"O(n)",code:`// Extra array — unnecessary`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`void reverseString(char[] s) {
    int lo=0, hi=s.length-1;
    while(lo<hi){char t=s[lo];s[lo++]=s[hi];s[hi--]=t;}
}`,note:"In-place swap. O(1) extra space. Simplest possible implementation."}},

{id:91,num:"LC#415",name:"Add Strings",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"String",algo:"Elementary Addition Simulation",tags:["string","math"],
 concept:"Simulate grade-school addition from right. Handle carry. Prepend carry at end.",
 brute:{tc:"O(max(m,n))",sc:"O(max(m,n))",code:`// Already optimal`},
 optimal:{tc:"O(max(m,n))",sc:"O(max(m,n))",code:`String addStrings(String num1, String num2) {
    StringBuilder sb=new StringBuilder();
    int i=num1.length()-1,j=num2.length()-1,carry=0;
    while(i>=0||j>=0||carry>0){
        int sum=carry;
        if(i>=0) sum+=num1.charAt(i--)-'0';
        if(j>=0) sum+=num2.charAt(j--)-'0';
        sb.append(sum%10);
        carry=sum/10;
    }
    return sb.reverse().toString();
}`,note:"Handles different lengths naturally. carry>0 in while condition handles final carry like 99+1=100."}},

{id:92,num:"LC#1768",name:"Merge Strings Alternately",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Two Pointer",algo:"Two Pointer",tags:["two-pointer","string"],
 concept:"Alternate chars from both strings. Append remaining from longer string.",
 brute:{tc:"O(m+n)",sc:"O(m+n)",code:`// Already optimal`},
 optimal:{tc:"O(m+n)",sc:"O(m+n)",code:`String mergeAlternately(String w1, String w2) {
    StringBuilder sb=new StringBuilder();
    int i=0,j=0;
    while(i<w1.length()&&j<w2.length()){sb.append(w1.charAt(i++));sb.append(w2.charAt(j++));}
    while(i<w1.length()) sb.append(w1.charAt(i++));
    while(j<w2.length()) sb.append(w2.charAt(j++));
    return sb.toString();
}`,note:"StringBuilder is efficient. append() is amortized O(1)."}},

{id:93,num:"LC#2390",name:"Removing Stars From a String",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Monotonic Stack",algo:"Stack",tags:["stack","string"],
 concept:"Stack simulation: push non-'*' chars. On '*': pop one char (removes closest non-star to left). Collect stack as result.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// Build string repeatedly removing star+prev — O(n²)`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`String removeStars(String s) {
    Deque<Character> stack=new ArrayDeque<>();
    for(char c:s.toCharArray()){
        if(c=='*') stack.pop(); // remove closest non-star to left
        else stack.push(c);
    }
    StringBuilder sb=new StringBuilder();
    while(!stack.isEmpty()) sb.append(stack.pop());
    return sb.reverse().toString(); // stack is LIFO so reverse
}`,note:"Stack contains remaining chars in order (need reverse at end). Guaranteed no invalid '*' per problem."}},

{id:94,num:"LC#1657",name:"Determine if Two Strings Are Close",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"HashMap",algo:"Frequency Signature",tags:["hashmap","string"],
 concept:"Two strings are close iff: (1) same set of distinct characters, (2) same multiset of frequencies.",
 brute:{tc:"O(n)",sc:"O(1)",code:`// Already optimal with frequency arrays`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean closeStrings(String w1, String w2) {
    if(w1.length()!=w2.length()) return false;
    int[] f1=new int[26],f2=new int[26];
    for(char c:w1.toCharArray()) f1[c-'a']++;
    for(char c:w2.toCharArray()) f2[c-'a']++;
    // Condition 1: same set of chars
    for(int i=0;i<26;i++) if((f1[i]==0)!=(f2[i]==0)) return false;
    // Condition 2: same multiset of frequencies
    Arrays.sort(f1); Arrays.sort(f2);
    return Arrays.equals(f1,f2);
}`,note:"Both conditions necessary and sufficient. Sort frequency arrays to compare multisets."}},

{id:95,num:"LC#2000",name:"Reverse Prefix of Word",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Two Pointer",algo:"Find + Reverse",tags:["two-pointer","string"],
 concept:"Find first occurrence of ch. Reverse word[0..index]. Standard two-pointer reversal on char array.",
 brute:{tc:"O(n)",sc:"O(n)",code:`// String concatenation — creates multiple strings`},
 optimal:{tc:"O(n)",sc:"O(n)",code:`String reversePrefix(String word, char ch) {
    char[] arr=word.toCharArray();
    int idx=word.indexOf(ch);
    if(idx==-1) return word;
    int lo=0,hi=idx;
    while(lo<hi){char t=arr[lo];arr[lo++]=arr[hi];arr[hi--]=t;}
    return new String(arr);
}`,note:"indexOf runs O(n). Reverse in-place on char array. Total O(n)."}},

{id:96,num:"LC#2337",name:"Move Pieces to Obtain a String",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"Two Pointer",algo:"Two Pointer Relative Position",tags:["two-pointer","string"],
 concept:"L can only move left, R only move right. Use two pointers skipping '_'. Check: order of L/R must match. R pointer in start must be <= target. L must be >=.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// BFS/simulation — too slow`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean canChange(String start, String target) {
    int n=start.length(),i=0,j=0;
    while(i<n||j<n){
        while(i<n&&start.charAt(i)=='_') i++;
        while(j<n&&target.charAt(j)=='_') j++;
        if(i==n&&j==n) return true;
        if(i==n||j==n) return false;
        if(start.charAt(i)!=target.charAt(j)) return false;
        if(start.charAt(i)=='L'&&i<j) return false; // L can't move right
        if(start.charAt(i)=='R'&&i>j) return false; // R can't move left
        i++;j++;
    }
    return true;
}`,note:"L can only move left (i>=j), R can only move right (i<=j). Same char type must appear in same relative order."}},

{id:97,num:"LC#1431",name:"Kids With the Greatest Number of Candies",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Greedy",algo:"Running Maximum",tags:["greedy","array"],
 concept:"Find global max. For each kid: candies[i] + extraCandies >= maxCandies → true.",
 brute:{tc:"O(n)",sc:"O(n)",code:`// Already optimal`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`List<Boolean> kidsWithCandies(int[] candies, int extra) {
    int max=0;
    for(int c:candies) max=Math.max(max,c);
    List<Boolean> res=new ArrayList<>();
    for(int c:candies) res.add(c+extra>=max);
    return res;
}`,note:"Two passes: find max, then check each. O(1) extra space (output not counted)."}},

{id:98,num:"LC#1071",name:"Greatest Common Divisor of Strings",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"String",algo:"GCD + String Concatenation Check",tags:["string","math"],
 concept:"If str1+str2==str2+str1, GCD string exists. Its length = gcd(len1,len2). Return str1[0..gcd_len-1].",
 brute:{tc:"O(n×m)",sc:"O(n+m)",code:`// Try all prefix lengths as potential GCD strings`},
 optimal:{tc:"O(n+m)",sc:"O(n+m)",code:`String gcdOfStrings(String str1, String str2) {
    // If concatenation in both orders differs, no GCD string
    if(!(str1+str2).equals(str2+str1)) return "";
    int gcd=gcd(str1.length(),str2.length());
    return str1.substring(0,gcd);
}
int gcd(int a,int b){return b==0?a:gcd(b,a%b);}`,note:"Key insight: if str1+str2 == str2+str1, then str1 and str2 are made of the same base string repeated."}},

{id:99,num:"LC#680",name:"Valid Palindrome II",cat:"String",difficulty:"Easy",
 sheets:["Amazon","LeetCode"],
 pattern:"Two Pointer",algo:"Two Pointer with One Skip",tags:["two-pointer","string"],
 concept:"Two pointer. On mismatch: try removing left OR removing right char. Check if either result is palindrome.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// Try removing each character — O(n²)`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`boolean validPalindrome(String s) {
    int lo=0,hi=s.length()-1;
    while(lo<hi){
        if(s.charAt(lo)!=s.charAt(hi))
            return isPalin(s,lo+1,hi)||isPalin(s,lo,hi-1); // try both removals
        lo++;hi--;
    }
    return true;
}
boolean isPalin(String s,int lo,int hi){
    while(lo<hi){if(s.charAt(lo++)!=s.charAt(hi--))return false;}return true;
}`,note:"At most ONE removal allowed. On mismatch, the removed char is either lo or hi — try both."}},

{id:100,num:"LC#2",name:"Add Two Numbers (Linked List / Big Number)",cat:"String",difficulty:"Medium",
 sheets:["Amazon","LeetCode"],
 pattern:"String",algo:"Carry Simulation",tags:["string","math"],
 concept:"Digit-by-digit addition from LSB. Same as Add Strings. Use StringBuilder for efficiency.",
 brute:{tc:"O(max(m,n))",sc:"O(max(m,n))",code:`// Already optimal`},
 optimal:{tc:"O(max(m,n))",sc:"O(max(m,n))",code:`// As linked list version:
ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummy=new ListNode(0); ListNode curr=dummy;
    int carry=0;
    while(l1!=null||l2!=null||carry!=0){
        int sum=carry;
        if(l1!=null){sum+=l1.val;l1=l1.next;}
        if(l2!=null){sum+=l2.val;l2=l2.next;}
        curr.next=new ListNode(sum%10);
        curr=curr.next; carry=sum/10;
    }
    return dummy.next;
}`,note:"carry!=0 in while condition handles final carry. dummy head simplifies edge cases."}},

/* ══════════════ BONUS — MORE AMAZON FAVORITES ══════════════ */
{id:101,num:"LC#875",name:"Koko Eating Bananas",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver","Coding Ninjas"],
 pattern:"Binary Search",algo:"Binary Search on Answer",tags:["binary-search","greedy"],
 concept:"BS on eating speed. lo=1, hi=max(piles). Check if speed mid finishes in h hours.",
 brute:{tc:"O(max×n)",sc:"O(1)",code:`for(int k=1;;k++) if(canFinish(piles,k,h)) return k;`},
 optimal:{tc:"O(n log max)",sc:"O(1)",code:`int minEatingSpeed(int[] piles, int h) {
    int lo=1,hi=Arrays.stream(piles).max().getAsInt();
    while(lo<hi){
        int mid=lo+(hi-lo)/2;
        long hours=0;
        for(int p:piles) hours+=(p+mid-1)/mid; // ceil(p/mid)
        if(hours<=h)hi=mid;else lo=mid+1;
    }
    return lo;
}`,note:"(p+mid-1)/mid = Math.ceil(p/mid) without floating point. Avoids Math.ceil."}},

{id:102,num:"CN",name:"Allocate Minimum Pages (BS on Answer)",cat:"1D Array",difficulty:"Hard",
 sheets:["Amazon","Striver","Love Babbar","Coding Ninjas","GFG"],
 pattern:"Binary Search",algo:"Binary Search on Answer",tags:["binary-search","greedy"],
 concept:"BS on max pages per student. lo=max(arr), hi=sum(arr). isValid: greedy check students needed.",
 brute:{tc:"O(n³)",sc:"O(1)",code:`// Try all possible allocations`},
 optimal:{tc:"O(n log S)",sc:"O(1)",code:`int allocatePages(int[] pages, int k) {
    int lo=0,hi=0;
    for(int p:pages){lo=Math.max(lo,p);hi+=p;}
    int ans=hi;
    while(lo<=hi){
        int mid=lo+(hi-lo)/2;
        if(isValid(pages,k,mid)){ans=mid;hi=mid-1;}else lo=mid+1;
    }
    return ans;
}
boolean isValid(int[] pages,int k,int maxP){
    int students=1,sum=0;
    for(int p:pages){if(sum+p>maxP){students++;sum=0;}sum+=p;}
    return students<=k;
}`,note:"SAME TEMPLATE as Ship Packages, Split Array. Master once, apply everywhere. lo=single largest, hi=total."}},

{id:103,num:"GFG",name:"Missing and Repeating",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","Striver","Love Babbar","GFG","Coding Ninjas"],
 pattern:"Bit Manipulation",algo:"Math / Cyclic Sort",tags:["math","xor"],
 concept:"Two equations: (miss-rep)=sum_diff, (miss²-rep²)=(miss+rep)(miss-rep). Solve for miss and rep.",
 brute:{tc:"O(n)",sc:"O(n)",code:`// HashSet to find duplicate, math for missing`},
 optimal:{tc:"O(n)",sc:"O(1)",code:`int[] findMissingRepeating(int[] arr) {
    long n=arr.length,s=0,sq=0;
    for(int x:arr){s+=x;sq+=(long)x*x;}
    long sumN=n*(n+1)/2, sqN=n*(n+1)*(2*n+1)/6;
    long diff=sumN-s;     // missing - repeating
    long sqDiff=sqN-sq;   // missing² - repeating²
    long sumXY=sqDiff/diff; // missing + repeating  (sqDiff/diff since a²-b²=(a-b)(a+b))
    long miss=(diff+sumXY)/2, rep=(sumXY-diff)/2;
    return new int[]{(int)miss,(int)rep};
}`,note:"diff = miss-rep. sqDiff/(miss-rep) = miss+rep. Solve system of 2 equations in 2 unknowns."}},

{id:104,num:"LC#435",name:"Non-overlapping Intervals",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Greedy",algo:"Sort by End Time",tags:["greedy","sorting","intervals"],
 concept:"Sort by end time. Keep interval with earliest end. Remove overlapping ones. Greedy proof: earliest end maximizes future flexibility.",
 brute:{tc:"O(n²)",sc:"O(n)",code:`// DP: for each interval find max chain length`},
 optimal:{tc:"O(n log n)",sc:"O(1)",code:`int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals,(a,b)->a[1]-b[1]); // sort by END
    int remove=0, end=Integer.MIN_VALUE;
    for(int[] iv:intervals){
        if(iv[0]>=end) end=iv[1]; // no overlap: keep it
        else remove++;              // overlap: remove (greedy keeps earlier end)
    }
    return remove;
}`,note:"Sort by END gives optimal greedy. Equivalent to finding max non-overlapping intervals (n - maxChain)."}},

{id:105,num:"LC#986",name:"Interval List Intersections",cat:"1D Array",difficulty:"Medium",
 sheets:["Amazon","LeetCode","Striver"],
 pattern:"Two Pointer",algo:"Two Pointer on Sorted Intervals",tags:["two-pointer","intervals"],
 concept:"Two pointers on both lists. Intersection if max(starts)<=min(ends). Advance pointer with smaller end.",
 brute:{tc:"O(mn)",sc:"O(1)",code:`// Check each pair from both lists`},
 optimal:{tc:"O(m+n)",sc:"O(1)",code:`int[][] intervalIntersection(int[][] A, int[][] B) {
    List<int[]> res=new ArrayList<>();
    int i=0,j=0;
    while(i<A.length&&j<B.length){
        int lo=Math.max(A[i][0],B[j][0]);
        int hi=Math.min(A[i][1],B[j][1]);
        if(lo<=hi) res.add(new int[]{lo,hi}); // valid intersection
        if(A[i][1]<B[j][1])i++;else j++;       // advance the one ending earlier
    }
    return res.toArray(new int[0][]);
}`,note:"Advance interval ending earlier — it can't contribute to future intersections."}},
];