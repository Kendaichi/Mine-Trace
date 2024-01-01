// SPDX-License-Identifier: MIT
pragma solidity >=0.8.19 <0.9.0;

contract ProductionStorage{
    struct MinedPerGroup{
        string groupName;
        string oreMined;
    }

    struct Production {
        uint256 id;
        string email;
        uint256 date;
        string totalOreMined;
        string month;
        string year;
        address sender;
    }

    Production[] public productions;
    mapping(uint256 => MinedPerGroup[]) public productionGroups;
    uint256 public idCounter;

    struct ProductionDetails {
        uint256 id;
        uint256 date;
        string totalOreMined;
        string month;
        string year;
        MinedPerGroup[] minedpergroups;
    }


   function addProduction(
        string memory _email,
        string memory _totalOreMined, 
        string memory _month,
        string memory _year,
        MinedPerGroup[] memory _minedPerGroup
        ) public {
        uint256 _id = ++idCounter;

        // Copy the MinedPerGroup data from memory to storage
        MinedPerGroup[] storage minedGroups = productionGroups[_id];
        for (uint256 i = 0; i < _minedPerGroup.length; i++) {
            minedGroups.push(_minedPerGroup[i]);
        }

        Production memory newProduction = Production({
            id: _id,
            date: block.timestamp,
            email: _email,
            totalOreMined: _totalOreMined,
            month: _month,
            year: _year,
            sender: msg.sender
        });

        productions.push(newProduction);
        }



    function getProductionsBySender(address _sender)
        public
        view
        returns (ProductionDetails[] memory)
    {
        // Count the number of productions by the given sender
        uint256 count = 0;
        for (uint256 i = 0; i < productions.length; i++) {
            if (productions[i].sender == _sender) {
                count++;
            }
        }

        // Create an array to store productions by the given sender
        ProductionDetails[] memory senderProductions = new ProductionDetails[](count);

        // Populate the array with productions by the given sender
        uint256 index = 0;
        for (uint256 i = 0; i < productions.length; i++) {
            if (productions[i].sender == _sender) {
                senderProductions[index] = ProductionDetails({
                    id: productions[i].id,
                    date: productions[i].date,
                    totalOreMined: productions[i].totalOreMined,
                    month: productions[i].month,
                    year: productions[i].year,
                    minedpergroups: productionGroups[productions[i].id]
                });
                index++;
            }
        }

        return senderProductions;
    }


    function getProductionByIdAndSender(uint256 _id, address _sender)
        public
        view
        returns (ProductionDetails memory)
    {
        // Loop through all productions
        for (uint256 i = 0; i < productions.length; i++) {
            // Check if the id and sender match the provided id and sender
            if (productions[i].id == _id && productions[i].sender == _sender) {
                // Return the matching production
                return ProductionDetails({
                    id: productions[i].id,
                    date: productions[i].date,
                    totalOreMined: productions[i].totalOreMined,
                    month: productions[i].month,
                    year: productions[i].year,
                    minedpergroups: productionGroups[productions[i].id]
                });
            }
        }

        // If no matching production was found, revert the transaction
        revert("No production found with the given id and sender");
    }

    function stringsEqual(string memory _a, string memory _b) internal pure returns (bool) {
        bytes memory a = bytes(_a);
        bytes memory b = bytes(_b);
            if (a.length != b.length) {
                return false;
            } else {
                for (uint i = 0; i < a.length; i ++) {
                    if (a[i] != b[i]) {
                        return false;
                    }
                }
                return true;
            }
    }

    function getProductionsByEmail(string memory _email)   public
        view
        returns (ProductionDetails[] memory){
            // Count the number of productions by the given sender
        uint256 count = 0;
        for (uint256 i = 0; i < productions.length; i++) {
            if (stringsEqual(productions[i].email, _email)) {
                count++;
            }
        }

        // Create an array to store productions by the given sender
        ProductionDetails[] memory productionsByEmail = new ProductionDetails[](count);


        // Populate the array with productions by the given sender
        uint256 index = 0;
        for (uint256 i = 0; i < productions.length; i++) {
            if (stringsEqual(productions[i].email, _email)) {
                productionsByEmail[index] = ProductionDetails({
                    id: productions[i].id,
                    date: productions[i].date,
                    totalOreMined: productions[i].totalOreMined,
                    month: productions[i].month,
                    year: productions[i].year,
                    minedpergroups: productionGroups[productions[i].id]
                });
                index++;
            }
        }

        return productionsByEmail;
    }



}