<a name="JsonToDict"></a>

## JsonToDict

A converter used to change a JSON file formatted in lists, into an object
with the same informations but formatted as a dictionnary. This makes the
manipulation of those informations a bit easier and is especially needed
for the algorithm of the findSubsystemElements in the system manager.

**Kind**: global class
**Properties**

| Name            | Type                | Description                                    |
| --------------- | ------------------- | ---------------------------------------------- |
| originJson      | <code>Object</code> | The object corresponding to the raw JSON file. |
| dictionnaryJson | <code>Object</code> | The converted JSON object, as a dictionnary.   |

---

<a name="JsonToDict+convertJson"></a>

### jsonToDict.convertJson(jsonName)

Converts the JSON file into a dictionnary.

**Kind**: instance method of [<code>JsonToDict</code>](#JsonToDict)

| Param    | Type                | Description                                                |
| -------- | ------------------- | ---------------------------------------------------------- |
| jsonName | <code>String</code> | The name of the raw JSON file (minus the .json extension). |

---
