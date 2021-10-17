# MMM-BTCFees
A module for the MagicMirror project which creates a table filled with a list gathered from a json request to show BTC Fees.

## Installation
````
git clone https://github.com/0nikola1/MMM-BTCFees/.git
cd MMM-BTCFees
npm install
````

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| url | https://mempool.space/api/v1/fees/recommended | The full url to get the json response from |
| arrayName | null | Define the name of the variable that holds the array to display |
| keepColumns | [] | Columns on json will be showed |
| size | 0-3 | Text size at table, 0 is default, and 3 is H3 |
| updateInterval | 15000 | Milliseconds between the refersh |
| descriptiveRow | "" | Complete html table row that will be added above the array data |




Configuration:

```javascript

                {
                        module: 'MMM-BTCFees',
                        position: 'top_right',
                        header: 'BTC current fees',
                        config: {
                           descriptiveRow: '<tr><td>Type of fee</td><td></td><td>sat/vB</td><td>USD</td></tr>',                                 
                                      
                       }
                },
```
