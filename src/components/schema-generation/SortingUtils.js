// This class is used for sorting the array of entities based on their priority
// Default algorithms have worst case of O(n^2), which is too high
// Stephan Maree
// 24/06/2024

class SortingUtils {
    merge(left,right) {
        let result = [];
        let leftIndex = 0;
        let rightIndex = 0;

        while (leftIndex < left.length && rightIndex < right.length) {
            if (left[leftIndex].getPriority() < right[rightIndex].getPriority()) {
                result.push(left[leftIndex]);
                leftIndex++;
            } else {
                result.push(right[rightIndex]);
                rightIndex++;
            }
        }
        
        return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
    }
    sort(array) {
        // Merge Sort based on priority
        if (array.length <= 1) {
            return array; // base case
        }

        const middle = Math.floor(array.length / 2);
        const left = array.slice(0,middle);
        const right = array.slice(middle);

        return this.merge(this.sort(left), this.sort(right));
    }
}

export default SortingUtils;