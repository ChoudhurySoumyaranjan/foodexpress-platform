package com.lucky.main.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebsiteController {

    @RequestMapping("/")
    public ResponseEntity<?> openIndexPage() {
        return ResponseEntity.ok().body("Index Page");
    }
}
