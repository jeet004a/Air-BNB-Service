import client from './elasticSearchService.js'

export async function createHotelRoomIndex() {
    // await client.indices.delete({ index: 'hotels' })
    const exists = await client.indices.exists({ index: 'hotels' });
    if (!exists.body) {
        await client.indices.create({
            index: 'hotels',
            body: {
                mappings: {
                    properties: {
                        name: {
                            type: 'text',
                            fields: {
                                keyword: { type: 'keyword' } // <-- Add this line
                            }
                        },
                        city: { type: 'keyword' },
                        description: { type: 'text' },
                        rooms: {
                            type: 'nested',
                            properties: {
                                id: { type: 'integer' },
                                roomType: { type: 'keyword' },
                                PPN: { type: 'integer' },
                                max_guests: { type: 'integer' },
                                description: { type: 'text' }
                            }
                        }
                    }
                }
            }
        });
    }
}




// export async function indexHotelWithRooms(hotel, rooms) {
//     // console.log(hotel)
//     // console.log(rooms)
//     await client.index({
//         index: 'hotels',
//         id: hotel.id.toString(),
//         body: {
//             id: hotel.id,
//             name: hotel.name,
//             city: hotel.city,
//             description: hotel.description,
//             rooms: rooms.map(room => ({
//                 id: room.id,
//                 roomType: room.roomType,
//                 PPN: room.PPN,
//                 max_guests: room.max_guests,
//                 description: room.description
//             }))
//         }
//     });
// }


export async function indexHotelWithRooms(hotel, newRoom) {
    const hotelId = hotel.id.toString();

    try {
        // 1. Check if hotel exists
        const result = await client.get({
            index: 'hotels',
            id: hotelId
        });

        const existingHotel = result._source;

        // 2. Filter out same room ID if exists (for updates)
        const updatedRooms = existingHotel.rooms.filter(
            room => room.id !== newRoom[0].id
        );

        // 3. Add new room
        updatedRooms.push(newRoom[0]);

        // 4. Index back full document (with all rooms)
        await client.index({
            index: 'hotels',
            id: hotelId,
            document: {
                ...existingHotel,
                name: hotel.name,
                city: hotel.city,
                description: hotel.description,
                rooms: updatedRooms
            }
        });

        console.log(`✅ Room ${newRoom[0].id} added to hotel ${hotelId}`);
    } catch (err) {
        if (err.meta.statusCode === 404) {
            // Hotel doesn't exist → create new document
            await client.index({
                index: 'hotels',
                id: hotelId,
                document: {
                    id: hotel.id,
                    name: hotel.name,
                    city: hotel.city,
                    description: hotel.description,
                    rooms: [newRoom]
                }
            });

            console.log(`✅ Hotel ${hotelId} created with room ${newRoom.id}`);
        } else {
            console.error('❌ Failed to add or update room:', err);
            throw err;
        }
    }
}