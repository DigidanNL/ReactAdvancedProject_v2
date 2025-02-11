import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  Button,
  Image,
  Input,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    image: "",
    startTime: "",
    endTime: "",
    categories: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/events");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Fout bij het ophalen van evenementen:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) throw new Error("Fout bij het toevoegen van evenement");
      const createdEvent = await response.json();
      setEvents([...events, createdEvent]);
      setNewEvent({
        title: "",
        description: "",
        image: "",
        startTime: "",
        endTime: "",
        categories: "",
      });
      onClose();
    } catch (error) {
      console.error("Fout bij het toevoegen van evenement:", error);
    }
  };

  const filteredEvents = events
    .filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((event) =>
      selectedCategory
        ? event.categories.includes(parseInt(selectedCategory))
        : true
    );

  return (
    <Box padding="4" maxWidth="1200px" margin="0 auto">
      <Heading as="h1" size="lg" mb="4">
        Onze Evenementen
      </Heading>

      <Input
        placeholder="Zoek evenementen"
        mb="4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Select
        placeholder="Filter op categorie"
        mb="4"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="1">Italiaanse keuken</option>
        <option value="2">Mexicaanse keuken</option>
        <option value="3">Franse keuken</option>
        <option value="4">Japanse keuken</option>
        <option value="5">Griekse keuken</option>
      </Select>

      <Button colorScheme="blue" onClick={onOpen} mb="4">
        Add Event
      </Button>

      <List spacing="6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <ListItem
              key={event.id}
              border="1px solid #ddd"
              padding="4"
              borderRadius="md"
              boxShadow="sm"
            >
              <Link to={`/event/${event.id}`}>
                <Heading as="h2" size="md" mb="2">
                  {event.title}
                </Heading>
              </Link>
              <Text mb="2">{event.description}</Text>
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
              <Text fontSize="sm" color="gray.500">
                Start: {new Date(event.startTime).toLocaleString()}
              </Text>
              <Text fontSize="sm" color="gray.500">
                End: {new Date(event.endTime).toLocaleString()}
              </Text>
            </ListItem>
          ))
        ) : (
          <Text>Geen evenementen gevonden...</Text>
        )}
      </List>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {newEvent.id ? "Evenement bewerken" : "Nieuw Evenement Toevoegen"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="4">
              <FormLabel>Titel</FormLabel>
              <Input
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Beschrijving</FormLabel>
              <Input
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Afbeeldings-URL</FormLabel>
              <Input
                value={newEvent.image}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, image: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Starttijd</FormLabel>
              <Input
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, startTime: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Eindtijd</FormLabel>
              <Input
                type="datetime-local"
                value={newEvent.endTime}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, endTime: e.target.value })
                }
              />
            </FormControl>

            <FormControl mb="4">
              <FormLabel>Categorieën</FormLabel>
              <Input
                value={newEvent.categories}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    categories: e.target.value,
                  })
                }
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} ml="3">
              Annuleren
            </Button>
            <Button colorScheme="blue" onClick={handleAddEvent}>
              Opslaan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EventsPage;
