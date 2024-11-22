import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

const EditEventPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [event, setEvent] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categories: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${eventId}`);
        if (!response.ok) throw new Error("Fout bij het ophalen van evenement");
        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.error("Fout bij het ophalen van evenement:", error);
        toast({
          title: "Fout bij het laden",
          description:
            "Er is een fout opgetreden bij het ophalen van het evenement.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchEvent();
  }, [eventId, toast]);

  const handleSaveEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) throw new Error("Fout bij het opslaan van evenement");
      toast({
        title: "Evenement opgeslagen",
        description: "Het evenement is succesvol opgeslagen.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate(`/event/${eventId}`);
    } catch (error) {
      console.error("Fout bij het opslaan van evenement:", error);
      toast({
        title: "Opslaan mislukt",
        description: "Het opslaan van het evenement is mislukt.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box padding="4" maxWidth="800px" margin="0 auto">
      <Heading as="h1" size="lg" mb="4">
        Evenement Bewerken
      </Heading>
      <FormControl mb="4">
        <FormLabel>Titel</FormLabel>
        <Input
          value={event.title}
          onChange={(e) => setEvent({ ...event, title: e.target.value })}
        />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Beschrijving</FormLabel>
        <Input
          value={event.description}
          onChange={(e) => setEvent({ ...event, description: e.target.value })}
        />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Afbeeldings-URL</FormLabel>
        <Input
          value={event.image}
          onChange={(e) => setEvent({ ...event, image: e.target.value })}
        />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Starttijd</FormLabel>
        <Input
          type="datetime-local"
          value={event.startTime}
          onChange={(e) => setEvent({ ...event, startTime: e.target.value })}
        />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Eindtijd</FormLabel>
        <Input
          type="datetime-local"
          value={event.endTime}
          onChange={(e) => setEvent({ ...event, endTime: e.target.value })}
        />
      </FormControl>

      <FormControl mb="4">
        <FormLabel>Categorieën</FormLabel>
        <Input
          value={event.categories}
          onChange={(e) => setEvent({ ...event, categories: e.target.value })}
        />
      </FormControl>

      <Button colorScheme="blue" onClick={handleSaveEvent} mr="4">
        Opslaan
      </Button>
      <Button colorScheme="gray" onClick={() => navigate(`/event/${eventId}`)}>
        Annuleren
      </Button>
    </Box>
  );
};

export default EditEventPage;
