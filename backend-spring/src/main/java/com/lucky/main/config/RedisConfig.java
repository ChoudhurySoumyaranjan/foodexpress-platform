package com.lucky.main.config;

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

        // JSON serializer
        GenericJackson2JsonRedisSerializer jsonSerializer =
                new GenericJackson2JsonRedisSerializer();

        // Default configuration
        RedisCacheConfiguration defaultConfig =
                RedisCacheConfiguration.defaultCacheConfig()
                        .entryTtl(Duration.ofMinutes(10)) // Default Time to Live = 10 minutes
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
//        cacheConfigurations.put(
//                "categories",
//               defaultConfig.entryTtl(Duration.ofMinutes(30))
//        );

        // Order → 5 minutes
//        cacheConfigurations.put(
//                "orders",
//                defaultConfig.entryTtl(Duration.ofMinutes(5))
//        );

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigurations)
                .build();
    }
}