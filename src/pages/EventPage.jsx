import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Image, Button } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

const EventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        if (!response.ok) throw new Error("Fout bij het ophalen van evenement");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Fout bij het ophalen van evenement:", error);
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleDeleteEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        navigate("/");
      } else {
        throw new Error("Fout bij het verwijderen van evenement");
      }
    } catch (error) {
      console.error("Fout bij het verwijderen van evenement:", error);
    }
  };

  if (!event) {
    return <Text>Evenement wordt geladen...</Text>;
  }

  return (
    <Box padding="4" maxWidth="800px" margin="0 auto">
      <Heading as="h1" size="lg" mb="4">
        {event.title}
      </Heading>
      {event.image && (
        <Image
          src={event.image}
          alt={event.title}
          maxWidth="600px"
          width="100%"
          mb="4"
          borderRadius="md"
        />
      )}
      <Text mb="2">{event.description}</Text>
      <Text fontSize="sm" color="gray.500">
        Start: {new Date(event.startTime).toLocaleString()}
      </Text>
      <Text fontSize="sm" color="gray.500">
        End: {new Date(event.endTime).toLocaleString()}
      </Text>
      <Box mt="4">
        <Button
          colorScheme="yellow"
          onClick={() => navigate(`/event/edit/${eventId}`)}
          mr="4"
        >
          Bewerken
        </Button>
        <Button colorScheme="red" onClick={handleDeleteEvent} mr="4">
          Verwijderen
        </Button>
        <Button colorScheme="teal" onClick={() => navigate("/")}>
          Terug naar Home
        </Button>
      </Box>
    </Box>
  );
};

export default EventPage;
