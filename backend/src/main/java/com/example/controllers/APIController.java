// FOR TESTING PURPOSES ONLY
package com.example.controllers;

// import org.springframework.http.HttpStatusCode;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
// import com.example.entities.Message;

// import java.util.*;

@RestController
public class APIController {
    // @RequestMapping("/testing")
    // public List<Message> index() {
    //     List<Message> list = new ArrayList<>();
    //     list.add(new Message("Hello"));
    //     list.add(new Message("wORLD"));
    //     return list;
    // }

    // @RequestMapping("/testing/{id}")
    // public ResponseEntity<Message> testing(@PathVariable Long id) {
    //     if (id == 0) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     return new ResponseEntity<>(new Message(String.valueOf(id)), HttpStatusCode.valueOf(200));
    // }

    // @RequestMapping("/params")
    // public ResponseEntity<Message> paramsTesting(@RequestParam() String field) {
    //     if (field == null) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     return new ResponseEntity<>(new Message(field), HttpStatusCode.valueOf(200));
    // }
}