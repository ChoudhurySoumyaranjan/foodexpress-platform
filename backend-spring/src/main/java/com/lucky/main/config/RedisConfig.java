package com.lucky.main.config;

import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class RedisConfig {

    @Bean
    public RedisCacheManager cacheManager(
            RedisConnectionFactory redisConnectionFactory) {

        // ObjectMapper for Redis JSON serialization
        ObjectMapper objectMapper = new ObjectMapper();

        // Support Java 8 date/time classes like LocalDateTime
        objectMapper.registerModule(new JavaTimeModule());

        // Store dates as readable ISO-8601 strings
        objectMapper.disable(
                SerializationFeature.WRITE_DATES_AS_TIMESTAMPS
        );

        // Allow Redis to preserve Java object type information
        BasicPolymorphicTypeValidator ptv =
                BasicPolymorphicTypeValidator.builder()
                        .allowIfSubType("com.lucky.main")
                        .allowIfSubType("java.util")
                        .build();

        objectMapper.activateDefaultTyping(
                ptv,
                ObjectMapper.DefaultTyping.NON_FINAL,
                JsonTypeInfo.As.PROPERTY
        );

        // JSON serializer
        GenericJackson2JsonRedisSerializer jsonSerializer =
                GenericJackson2JsonRedisSerializer.builder()
                        .objectMapper(objectMapper)
                        .build();

        // Default configuration
        RedisCacheConfiguration defaultConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .entryTtl(Duration.ofMinutes(10))
                        .serializeValuesWith(
                                RedisSerializationContext.SerializationPair
                                        .fromSerializer(jsonSerializer)
                        );

        // Cache-specific TTL
        Map<String, RedisCacheConfiguration> cacheConfigurations =
                new HashMap<>();

        // Food → 10 minutes
        cacheConfigurations.put(
                "foods",
                defaultConfig
        );

        // Category → 30 minutes
        // cacheConfigurations.put(
        //         "category",
        //         defaultConfig.entryTtl(Duration.ofMinutes(30))
        // );

        // Order → 5 minutes
        // cacheConfigurations.put(
        //         "orders",
        //         defaultConfig.entryTtl(Duration.ofMinutes(5))
        // );

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}