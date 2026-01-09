import { createRoomService, getAllRoomsAdminService, getAllRoomsService, adminRoomValidationService } from '../services/roomService.js'
import client from '../elasticSearch/elasticSearchService.js'

export const roomController = async(req, res, next) => {
    try {
        const { email } = req.user

        const response = await createRoomService({...req.body, email })
        console.log('abc', response)
        if (!response) {
            return res.status(400).json({
                success: false,
                message: 'No room capacity left or room creation failed',
            })
        }
        return res.status(201).json({
            success: true,
            message: response,
        })

    } catch (error) {
        console.log('Error in create room router', error)
    }
}

export const getAllRoomsAdminControlller = async(req, res, next) => {
    try {
        const response = await getAllRoomsAdminService(req.user)
        return res.status(200).json({
            success: true,
            message: "fetched successfully",
            response
        })
    } catch (error) {
        console.log('Error in get all admin room router', error)
    }
}


export const getAllRoomsController = async(req, res, next) => {
    try {
        const response = await getAllRoomsService()
        return res.status(200).json({
            success: true,
            message: "All rooms fetched successfully",
            response
        })
    } catch (error) {
        console.log('error get all rooms controller', error)
    }
}



export const adminRoomValidationController = async(req, res, next) => {
    try {
        // console.log(req.query)
        const response = await adminRoomValidationService({ host_id: req.user.admin_id, ...req.query })
        if (response) {
            return res.status(200).json({
                success: true,
                message: "Admin validated"
            })
        }
        return res.status(200).json({
            success: false,
            message: "Admin is not authorized perform this action"
        })
    } catch (error) {
        console.log('error from admin room validation controller', error)
    }
}



//Elastic Search controller
// export const elasticSearchController = async(req, res) => {
//     const { q, city, roomType, minPrice, maxPrice } = req.query;
//     console.log('minPrice', minPrice)

//     const filters = [];

//     // City filter
//     if (city) {
//         filters.push({
//             term: {
//                 city: city.toLowerCase()
//             }
//         });
//     }

//     // Nested room filters
//     const nestedRoomFilters = [];

//     if (roomType) {
//         nestedRoomFilters.push({
//             term: {
//                 'rooms.roomType': roomType
//             }
//         });
//     }

//     if (minPrice || maxPrice) {
//         nestedRoomFilters.push({
//             range: {
//                 'rooms.PPN': {
//                     gte: minPrice ? parseInt(minPrice) : undefined,
//                     lte: maxPrice ? parseInt(maxPrice) : undefined
//                 }
//             }
//         });
//     }

//     // const rangeFilter = {};
//     // if (minPrice) rangeFilter.gte = parseInt(minPrice, 10);
//     // if (maxPrice) rangeFilter.lte = parseInt(maxPrice, 10);

//     // if (Object.keys(rangeFilter).length > 0) {
//     //     nestedRoomFilters.push({
//     //         range: { 'rooms.PPN': rangeFilter }
//     //     });
//     // }

//     try {
//         const result = await client.search({
//             index: 'hotels',
//             query: {
//                 bool: {
//                     must: q ? [{
//                         multi_match: {
//                             query: q,
//                             fields: ['name', 'description', 'rooms.description'],
//                             fuzziness: 'AUTO'
//                         }
//                     }] : [],
//                     filter: [
//                         ...filters,
//                         ...(nestedRoomFilters.length > 0 ? [{
//                             nested: {
//                                 path: 'rooms',
//                                 query: {
//                                     bool: {
//                                         filter: nestedRoomFilters
//                                     }
//                                 }
//                             }
//                         }] : [])
//                     ]
//                 }
//             }
//         });

//         const hits = result.hits.hits.map(hit => hit._source);

//         return res.status(200).json({
//             success: true,
//             message: 'Search successful',
//             data: hits
//         });
//     } catch (error) {
//         console.error('Search failed:', error);
//         return res.status(500).json({
//             success: false,
//             message: 'Search failed',
//             //   error: error.message
//         });
//     }
// }


//Nornal Search Feature
// export async function elasticSearchController(req, res, next) {
//     try {
//         const query = req.query.q;
//         if (!query) {
//             return res.status(400).json({ error: "Missing search query ?q=" });
//         }

//         const isNumeric = !isNaN(query);

//         const esQuery = {
//             index: "hotels",
//             body: {
//                 query: {
//                     bool: {
//                         should: [{
//                                 match: {
//                                     name: {
//                                         query,
//                                         fuzziness: "AUTO"
//                                     }
//                                 }
//                             },
//                             {
//                                 match: {
//                                     description: {
//                                         query,
//                                         fuzziness: "AUTO"
//                                     }
//                                 }
//                             },
//                             {
//                                 nested: {
//                                     path: "rooms",
//                                     query: {
//                                         match: {
//                                             "rooms.description": {
//                                                 query,
//                                                 fuzziness: "AUTO"
//                                             }
//                                         }
//                                     }
//                                 }
//                             },
//                             ...(isNumeric ?
//                                 [{
//                                     nested: {
//                                         path: "rooms",
//                                         query: {
//                                             term: { "rooms.PPN": parseInt(query, 10) }
//                                         }
//                                     }
//                                 }] :
//                                 [])
//                         ],
//                         minimum_should_match: 1
//                     }
//                 }
//             }
//         };

//         const result = await client.search(esQuery);

//         return res.json({
//             total: result.hits.total.value,
//             hotels: result.hits.hits.map(hit => ({
//                 id: hit._id,
//                 ...hit._source
//             }))
//         });
//     } catch (err) {
//         console.error("❌ Search failed:", err);
//         return res.status(500).json({ error: "Search failed", details: err.message });
//     }
// }


//Below search query if inner hits matchs 

export const elasticSearchController = async(req, res, next) => {
    try {
        const query = req.query.q;
        if (!query) {
            return res.status(400).json({ error: "Missing search query ?q=" });
        }

        const isNumeric = !isNaN(query);

        const esQuery = {
            index: "hotels",
            body: {
                query: {
                    bool: {
                        should: [{
                                match: {
                                    name: {
                                        query,
                                        fuzziness: "AUTO"
                                    }
                                }
                            },
                            {
                                match: {
                                    description: {
                                        query,
                                        fuzziness: "AUTO"
                                    }
                                }
                            },
                            {
                                nested: {
                                    path: "rooms",
                                    query: {
                                        bool: {
                                            should: [{
                                                    match: {
                                                        "rooms.description": {
                                                            query,
                                                            fuzziness: "AUTO"
                                                        }
                                                    }
                                                },
                                                ...(isNumeric ? [{
                                                    term: { "rooms.PPN": parseInt(query, 10) }
                                                }] : [])
                                            ]
                                        }
                                    },
                                    inner_hits: {
                                        _source: ["id", "roomType", "PPN", "max_guests", "description"]
                                    }
                                }
                            }
                        ],
                        minimum_should_match: 1
                    }
                }
            }
        };

        const result = await client.search(esQuery)

        console.log(result.hits.hits[0].inner_hits.rooms.hits.hits)

        return res.json({
            total: result.hits.total.value,
            hotels: result.hits.hits.map(hit => ({
                id: hit._id,
                hotel: {
                    name: hit._source.name,
                    city: hit._source.city,
                    description: hit._source.description
                },
                matchingRooms: hit.inner_hits.rooms.hits.hits.map(r => r._source) || []
            }))
        });
    } catch (err) {
        console.error("❌ Search failed:", err);
        return res.status(500).json({ error: "Search failed", details: err.message });
    }
}