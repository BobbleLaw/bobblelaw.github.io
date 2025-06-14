# Cpp Interview Questions

## Embedded Software Development Engineer

### Difference between Serial Communication protocols like I2C, SPI and UART

![I2C, SPI and UART](https://media.licdn.com/dms/image/v2/D5612AQHZQKpJFd0INA/article-inline_image-shrink_1000_1488/B56ZU2XcHoHQAQ-/0/1740373869897?e=1752105600&v=beta&t=_1Jye7I5u_mmeYXEgkDqoFNYldSpvhXkZJmtMEVu3hY)

| Feature       | UART<br>(Universal Asynchronous Receiver Transmitter)                 | I2C<br>(Inter-Integrated Circuit)                                | SPI<br>(Serial Peripheral Interface)                      |
| ------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| Wire          | 2 - TX(transmit), RX(receive)                                         | 2 - SDA(data), SCL(clock)                                        | 4+ - MOSI, MOSO, SCLK, SS (chip select), one CS per slave |
| Speed         | Low                                                                   | Medium                                                           | High                                                      |
| Communication | Asynchronous (no shared clock); devices must agree on baud rate       | Synchronous, multi-master/multi-slave                            | Synchronous, full-duplex                                  |
| Topology      | Point-to-Point                                                        | Multi-Slave                                                      | Multi-Slave with Chip Select(CS)                          |
| Use Case      | Simple point-to-point communication (e.g. debug console, GPS modules) | Connecting multiple low-speed peripherals (e.g. sensors, EEPROM) | High-speed communication with sensors, flash, displays    |

Answer:

“In my experience, I use UART for debug and simple comms, I2C when I need multiple low-speed sensors, and SPI when I care about speed or use peripherals like displays or flash chips.”

### UART (Universal Asynchronous Receiver-Transmitter)

UART, or Universal Asynchronous Receiver-Transmitter, is a hardware communication protocol commonly used in embedded systems for serial communication. It allows for the exchange of data between devices, such as microcontrollers, sensors, and computers, using a simple two-wire interface: one for transmitting data (TX) and one for receiving data (RX).

#### Key Features of UART:

**Asynchronous Communication:** UART does not require a clock signal to synchronize the transmitter and receiver. Instead, it uses start and stop bits to frame the data, which allows for flexible timing.

**Data Framing:** Each data packet typically consists of:
- 1 Start Bit: Indicates the beginning of a transmission.
- Data Bits: Usually 5 to 9 bits of actual data.
- Optional Parity Bit: Used for error checking (even, odd, or none).
- 1 or 2 Stop Bits: Indicate the end of the transmission.

**Baud Rate:** The speed of communication is defined by the baud rate, which indicates how many bits per second are transmitted. Both the transmitter and receiver must be set to the same baud rate for successful communication.

**Full Duplex:** UART can send and receive data simultaneously, allowing for full-duplex communication.

**Simplicity:** The UART protocol is simple to implement in hardware and software, making it a popular choice for many embedded applications.

#### Applications of UART:

**Microcontroller Communication:** UART is often used to interface microcontrollers with peripherals like GPS modules, Bluetooth devices, and GSM modules.

**Debugging:** Developers frequently use UART for debugging purposes, allowing them to send log messages from an embedded system to a terminal on a computer.

**Data Transfer:** It is commonly used for low-speed data transfer between devices.

#### Example of UART Communication:

In a typical scenario, a microcontroller might send a command to a GPS module using UART. The microcontroller configures the UART settings (baud rate, data bits, etc.), sends a command string, and waits for a response, which the GPS module sends back over the same UART interface.

Overall, UART is a foundational technology in embedded systems, providing a reliable way to facilitate communication between various components.

### I2C (Inter-Integrated Circuit)

#### Working of I2C Communication Protocol
It uses only 2 bi-directional open-drain lines for data communication called SDA and SCL. Both these lines are pulled high.

+ **Serial Data (SDA):** Transfer of data takes place through this pin.
+ **Serial Clock (SCL) :** It carries the clock signal.

I2C operates in 2 modes
+ Master mode
+ Slave mode

Each data bit transferred on SDA line is synchronized by a high to the low pulse of each clock on the SCL line.

According to I2C protocols, the data line can not change when the clock line is high, it can change only when the clock line is low. The 2 lines are open drain, hence a pull-up resistor is required so that the lines are high since the devices on the I2C bus are active low. The data is transmitted in the form of packets which comprises 9 bits. The sequence of these bits are
1. Start Condition: 1 bit
2. Slave Address: 8 bit
3. Acknowledge: 1 bit

#### Steps of I2C Data Transmission

Here are the steps of I2C (Inter-Integrated Circuit) data transmission

1. **Start Condition:** The master device sends a start condition by pulling the SDA line low while the SCL line is high. This signals that a transmission is about to begin.
2. **Addressing the Slave:** The master sends the 7-bit address of the slave device it wants to communicate with, followed by a read/write bit. The read/write bit indicates whether it wants to read from or write to the slave.
3. **Acknowledge Bit (ACK):** The addressed slave device responds by pulling the SDA line low during the next clock pulse (SCL). This confirms that the slave is ready to communicate.
4. **Data Transmission:** The master or slave (depending on the read/write operation) sends data in 8-bit chunks. After each byte, an ACK is sent to confirm that the data has been received successfully.
5. **Stop Condition:** When the transmission is complete, the master sends a stop condition by releasing the SDA line to high while the SCL line is high. This signals that the communication session has ended.

***Q: Explain the physical layer of the I2C protocol***

***Answer:***

I2C is pure master and slave communication protocol, it can be the multi-master or multi-slave but we generally see a single master in I2C communication. In I2C only two-wire are used for communication, one is data bus (SDA) and the second one is the clock bus (CLK).

All slave and master are connected with same data and clock bus, here important thing is to remember these buses are connected to each other using the WIRE-AND configuration which is done by to putting both pins is open drain. The wire-AND configuration allows in I2C to connect multiple nodes to the bus without any short circuits from signal contention.

The open-drain allows the master and slave to drive the line low and release to high impedance state. So In that situation, when master and slave release the bus, need a pull resistor to pull the line high. The value of the pull-up resistor is very important as per the perspective of the design of the I2C system because the incorrect value of the pull-up resistor can lead to signal loss.

Note: We know that I2c communication protocol supports multiple masters and multiple slaves, but most system designs include only one master.

***Question: Explain the operation and frame of I2C protocol***

***Answer:***

I2C is a  chip to chip communication protocol. In I2C, communication is always started by the master. When the master wants to communicate with slave then he asserts a start bit followed by the slave address with read/write bit.

After asserting the start bit, all slave comes in the attentive mode. If the transmitted address match with any of the slave on the bus then an ACKNOWLEDGEMENT (ACK) bit is sent by the slave to the master.

After getting the ACK bit, master starts the communication. If there is no slave whose address match with the transmitted address then master received a NOT-ACKNOWLEDGEMENT (NACK) bit, in that situation either master assert the stop bit to stop the communication or assert a repeated start bit on the line for new communication.

When we send or receive the bytes in i2c, we always get a NACK bit or ACK bit after each byte of the data is transferred during the communication.

In I2C, one bit is always transmitted on every clock. A byte which is transmitted in I2C could be an address of the device, the address of register or data which is written to or read from the slave.

In I2C, SDA line is always stable during the high clock phase except for the start condition, stop condition and repeated start condition. The SDA line only changes their state during the low clock phase.

See the below image,
![I2C frame](../images/i2c-frame.jpg)

***Question: What is START bit and STOP bit?***

***Answer:***

**Start Condition**:
The default state of SDA and SCL line is high. A master asserts the start condition on the line to start the communication. A high to low transition of the SDA line while the SCL line is high called the START condition. The START condition is always asserted by the master. The I2C bus is considered busy after the assertion of the START bit.

![i2c start bit](../images/i2start.jpg)

**Stop Condition**:
The STOP condition is asserted by the master to stop the communication. A Low to high transition of SDA line while the SCL line is high called the STOP condition. The STOP condition is always asserted by the master. The I2C bus is considered free after the assertion of the STOP bit.

![I2c stop](../images/stop-min.jpg)

*Note: A START and STOP condition always asserted by the master.*

***Question: What is the repeated start condition?***

***Answer:***

The repeated start condition similar to the START condition but both are different from each other. The repeated start is asserted by the master before the stop condition (When the bus is not in an idle state).

A Repeated Start condition is asserted by the master when he does not want to lose their control from the bus. The repeated start is beneficial for the master when it wants to start a new communication without asserting the stop condition.

*Note: Repeated start is beneficial when more than one master connected with the I2c Bus.*

***Question: What is the standard bus speed in I2C?***
There are following speed mode in I2C:

| Mode            | Speed      |
| --------------- | ---------- |
| Standard-mode   | 100 kbit/s |
| Fast-mode       | 400 kbit/s |
| Fast-mode Plus  | 1 Mbit/s   |
| High-speed mode | 3.4 Mbit/s |

***Question: What is the limiting factor as to how many devices can go on the I²C bus?***

***Answer:***

It depends on the total capacitance.

***Question: Who sends the start bit?***

***Answer:***

In I2C master sends the start bit.

***Question: What is the maximum bus length of the I2C bus?***

***Answer:***

It depends on the bus-load (capacitance) and the speed. Basically I2C is not designed for long-distance. It is limited to a few meters. For fast mode, and resistor pullup, capacitance should be less than 200pF, according to “UM10204.pdf” NXP document. So If your wire is 20pF/25cm and you have another 80pF of stray and input capacitance, you’re limited to 1.5m of cable length. But it is only a rough assumption. It can vary in real scenarios.

***Question: What is a bus arbitration?***

***Answer:***

The arbitration is required in the case of a multi-master, where more than one master is tried to communicate with a slave simultaneously. In I2C arbitration is achieved by the SDA line.

For Example,
Suppose two masters in the I2C bus is tried to communicate with a slave simultaneously then they will assert a start condition on the bus. The SCL clock of the I2c bus would be already synchronized by the wired and logic.

![Bus Arbitration](../images/arbitration-min.jpg)

In the above case, everything will be good till the state of SDA line will same what is the masters driving on the bus. If any master sees that the state of SDA line differs, what is it driving then they will exit from the communication and lose their arbitration.

*Note: Master which is losing their arbitration will wait till the bus become free.*

***Question: What is I2C clock stretching?***

***Answer:***

In I2c, communication can be paused by the clock stretching to holding the SCL line low and it cannot continue until the SCL line released high again.

![Clock Stretching](../images/i2c-clock-stretch.jpg)

In I2C, slave able to receive a byte of data on the fast rate but sometimes slave takes more time in processing the received bytes in that situation slave pull the SCL line to pause the transaction and after the processing of the received bytes, it again released the SCL line high again to resume the communication.

The clock stretching is the way in which slave drive the SCL line but it is the fact, most of the slave does not drive the SCL line

Note: In the I2C communication protocol, most of the I2C slave devices do not use the clock stretching feature, but every master should support the clock stretching.

***Question: What is I2C clock synchronization?***

***Answer:***

Unlike RS-232, I2C is synchronous communication, in which the clock is always generated by the master and this clock is shared by both master and slave. In the case of multi-master, all master generate their own SCL clock, hence it is necessary that the clock of all master should be synchronized. In the i2C, this clock synchronization is done by wired and logic.

For a better understanding, I am taking an example, where two masters try to communicate with a slave. In that situation, both masters generate their own clock, master M1 generate clk1 and master M2 generate clk2 and clock which observed on the bus is SCL.

![Clock Sync](../images/Clock-sync.jpg)

The SCL clock would be the Anding (clk1 & clk2) of clk1 and clk2 and most interesting thing is that highest logic 1 of SCL line defines by the CLK which has lowest logic 1.

#### More I2C questions

1. Can devices be added and removed while the system is running (Hot swapping) in I2C?
2. What is the standard bus speed in I2C?
3. How many devices can be connected in a standard I2C communication?
4. What are the 2 roles of nodes in I2C communication?
5. What are the modes of operation in I2C communication?
6. What is bus arbitration?
7. Advantages and limitations of I2C communication?
8. How many wires are required for I2C communication? What are the signals involved in I2C?
9. What is START bit and STOP bit?
10. How will the master indicate that it is either address/data? How will it intimate to the slave that it is going to either read/write?
11. Is it possible to have multiple masters in I2C?
12. In write transaction, the Master monitors the last ACK and issues STOP condition - True/False?
13. In read transaction, the master doesnot acknowledge the final byte it receives and issues STOP condition - True/False?
14. What is SPI communication?
15. How many wires are required for SPI communication?
16. What are the 4 logic signals specified by SPI bus?
17. Does SPI slave acknowledge the receipt of data?
18. SPI has higher throughput than I2C - True/False?
19. Is it better to use I2C or SPI for data communication between a microprocessor and DSP?
20. Is it better to use I2C or SPI for data communication from ADC?
21. Duplex communication is possible by simultaneously using MOSI and MISO during each SPI clock cycle - True/False?
22. Is it possible to connect SPI slaves in daisy chain?
23. What is the role of shift register in Master and Slave devices in SPI?
24. How will the master convey that it is stopping the transmission of data?
25. What is bit banging?

### SPI (Serial Peripheral Interface)

SPI protocol uses a master-slave architecture. The master device controls the communication, and one or more slave devices get connected to it. The SPI protocol typically involves the following four key signals:

+ **MOSI (Master Output Slave Input):** Data line through which the master sends data to the slave.
+ **MISO (Master Input Slave Output):** Data line in which the slave sends data back to the master.
+ **SCK (Serial Clock):** This clock signal synchronizes the data transfer between the master and the slave.
+ **SS/CS (Slave Select/Chip Select):** The signal from the master to select the active slave device.

#### Multiple Slave Configuration Options
+ **Independent Slave Select Lines:** Each slave device can have its own SS line for individual selection.
  + Advantages
    + Simple and Direct: Each slave device is independently addressed via its SS line. It allows easy communication with individual devices without worrying about collisions or sharing data paths.
    + Flexible: Each device can operate at different SPI clock speeds, modes (CPOL/CPHA), and configurations.
    + No Need for Special Firmware: The SPI controller can select the slave by toggling the SS line, and there's no need for the slaves to be aware of each other.
  + Disadvantages
    + More Pins Required: A trade-off is the need for more GPIO pins on the master. For example, if you have five slave devices, you will need five independent SS pins on the master, which could limit pin availability.
    + Scalability: As the number of slaves increases, the number of SS lines required also increases, which may not be feasible in space-constrained designs.
  + Usages
    + Best for systems where speed and low latency are critical, and each device needs to operate with different configurations or speeds.
    + It is useful in systems with fewer slaves or systems where the master has enough GPIO pins to handle all the slaves.
    + Ideal for real-time applications where data from each slave needs to be processed separately and with minimal delay.
+ **Daisy-Chaining:** Some systems allow slaves to be connected in a chain, reducing the number of SS lines needed.
  + Advantages:
    + Fewer Pins Required: There is only one SS line, and the number of GPIO pins required on the master does not increase with the number of slaves. Hence, it is scalable for large systems with many devices.
    + Reduces Wiring Complexity: With fewer lines needed, the physical complexity of the system is reduced, making it easier to route and manage.
    + Simplifies Large-Scale Systems: For IoT devices with many peripherals, a daisy-chaining approach helps keep the system clean and simple, with fewer constraints on pin resources.
  + Disadvantages:
    + Potential for Increased Latency: Each slave in the chain must receive and forward data, which introduces latency. If you have many slaves, the total data transfer time will increase because each slave must process and pass the data sequentially.
    + Fixed Communication Speed: All slaves must communicate at the same SPI speed and clock mode. Different communication speeds or configurations for each device in a daisy-chained setup are difficult.
    + Complexity in Data Handling: Depending on the specific implementation, the master requires special logic to manage data transmission and understand what data belongs to which slave.
  + Usages
    + It is best for systems with many slaves and limited GPIO pins or when the master pin count is constrained (e.g., in small or cost-sensitive designs).
    + Suitable for non-time-critical systems where communication speed and latency are not as important.
    + It is common in sensor networks or sensor arrays where devices with similar data rates are controlled altogether.

#### Working Principle
+ The master generates the clock signal (SCLK) and controls the communication.
+ Data transmission occurs bit-by-bit over MOSI and MISO.
+ Slave device selection uses the SS/CS line: When SS is low, the corresponding slave is active; other slaves remain inactive.
+ The master and slave exchange data in full-duplex mode, synchronized with the clock edges.

### What happens when you boot?

Reference: [Link](https://leetcode.com/discuss/post/124638/what-happens-in-the-background-from-the-f4k7h/), [Link](https://opensource.com/article/17/2/linux-boot-and-startup)

```mermaid
graph TD;
    A(Power On) --> B(BIOS)
    B --> C("Master Boot Record (MBR)")
    C --> D("Boot Loader (e.g. GRUB)")
    D --> E("Kernal (Linux OS)")
    E --> F(Initial RAM disk)
    F --> G(/sbin/init)
    G --> H(Command Shell using getty)
    H --> I("X Windows System (GUI)")
```

1. BIOS

The Basic Input/Output System (BIOS) initializes the hardware, including the screen and keyboard, and tests the main memory. This process is also called POST (Power On Self Test).

The BIOS software is stored on a ROM chip on the motherboard. After this, the remainder of the boot process is completely controlled by the operating system.

2. Master Boot Records (MBR) and Boot Loader

Once the POST is completed, the system control passes from the BIOS to the boot loader. The boot loader is usually stored on one of the hard disks in the system, either in the boot sector (for traditional BIOS/MBR systems). Up to this stage, the machine does not access any mass storage media. Thereafter, information on the date, time, and the most important peripherals are loaded from the CMOS values (after a technology used for the battery-powered memory store - which allows the system to keep track of the date and time even when it is powered off).

A number of boot loaders exist for Linux; the most common ones are GRUB (for GRand Unified Boot loader) and ISOLINUX (for booting from removable media). Most Linux boot loaders can present a user interface for choosing alternative options for booting Linux, and even other operating systems that might be installed. When booting Linux, the boot loader is responsible for loading the kernel image and the initial RAM disk (which contains some critical files and device drivers needed to start the system) into memory.

3. Boot Loader in Action

The boot loader has two distinct stages:

First Stage:

For systems using the BIOS/MBR method, the boot loader resides at the first sector of the hard disk also known as the Master Boot Record(MBR). The size of the MBR is just 512 bytes. In this stage, the boot loader examines the partition table and finds a bootable partition. Once it finds a bootable partition, it then searches for the second stage bootloader e.g, GRUB, and loads it into RAM (Random Access Memory).

Second Stage:

The second stage boot loader resides under /boot. A splash screen is displayed which allows us to choose which Operating System (OS) to boot. After choosing the OS, the boot loader loads the kernel of the selected operating system into RAM and passes control to it.
The boot loader loads the selected kernel image (in the case of Linux) and passes control to it. Kernels are almost always compressed, so it's first job is to uncompress itself. After this, it will check and analyze the system hardware and initialize any hardware device drivers built into the kernel.

4. The Linux Kernel

The boot loader loads both the kernel and an initial RAM–based filesystem (initramfs) into memory so it can be used directly by the kernel.
When the kernel is loaded in RAM, it immediately initializes and configures the computer’s memory and also configures all the hardware attached to the system. This includes all processors, I/O subsystems, storage devices, etc. The kernel also loads some necessary user space applications.

5. The Initial RAM Disk

The initramfs filesystem image contains programs and binary files that perform all actions needed to mount the proper root filesystem, like providing kernel functionality for the needed file system and device drivers for mass storage controllers with a facility called udev (for User Device) which is responsible for figuring out which devices are present, locating the drivers they need to operate properly, and loading them. After the root filesystem has been found, it is checked for errors and mounted.

The mount program instructs the operating system that a file system is ready for use, and associates it with a particular point in the overall hierarchy of the filesystem (the mount point). If this is successful, the initramfs is cleared from RAM and the init program on the root filesystem (/sbin/init) is executed.

init handles the mounting and pivoting over to the final real root filesystem. If special hardware drivers are needed before the mass storage can be accessed, they must be in the initramfs image.

6. /sbin/init and Services

Once the kernel has set up all its hardware and mounted the root filesystem, the kernel runs the /sbin/init program. This then becomes the initial process, which then starts other processes to get the system running. Most other processes on the system trace their origin ultimately to init; the exceptions are kernel processes, started by the kernel directly for managing internal operating system details.

Traditionally, this process startup was done using conventions that date back to System V UNIX, with the system passing through a sequence of runlevels containing collections of scripts that start and stop services. Each runlevel supports a different mode of running the system. Within each runlevel, individual services can be set to run, or to be shut down if running. Newer distributions are moving away from the System V standard, but usually support the System V conventions for compatibility purposes.

Besides starting the system, init is responsible for keeping the system running and for shutting it down cleanly. It acts as the "manager of last resort" for all non-kernel processes, cleaning up after them when necessary, and restarts user login services as needed when users log in and out.

7. Text Mode Login

Near the end of the boot process, init starts a number of text-mode login prompts (done by a program called getty). These enable you to type your username, followed by your password, and to eventually get a command shell.

Usually, the default command shell is bash (the GNU Bourne Again Shell), but there are a number of other advanced command shells available. The shell prints a text prompt, indicating it is ready to accept commands; after the user types the command and presses Enter, the command is executed, and another prompt is displayed after the command is done.

8. X Window System (Optional)

### Data protection strategies

1. `volatile` keyword

```cpp
volatile int kX;
// ...
int Y = (kX + kX) / 2; // Force kX to be read twice
```

+ Use the volatile keyword in C or C++ if data can be changed between times it is read.
+ Use the volatile keyword in C or C++ if data is being produced by another task or hardware device.

Limitations
+ It doesn’t provide protection if multiple tasks want to change the value.
+ It doesn’t provide protection for data values that take more than one instruction to read or write, if a task switch could happen partway through the read or write.

2. Atomic and disable interrupts

3. Queues

+ Use a queue for single-reader/single-writer sharing of streams of data.

4. Mutexes

+ Use a mutex for any shared data that can’t be protected with a simpler locking mechanism.
+ A mutex is a heavyweight protection mechanism, so you should only use it when lighter-weight mechanisms won’t get the job done
+ Every separate shared resource needs to have its own mutex.

```c
// Shared data structure
volatile int SharedData;

// Mutex
#define UNLOCKED 0
#define LOCKED   1
volatile unsigned short int SharedDataMutex = UNLOCKED;

// Attempt to lock mutex
void LockMutex(volatile unsigned short int* mutex) {
  unsigned short int initValue;
  do {
    // Ensure atomic access
    _DisableInterupts();
    initValue = *mutex;
    *mutex = LOCKED;
    _EnableInterupts();
  } while (initValue == LOCKED);

  // Exist loop when lock acquired with LOCKED state
  // ...
}

void ReleaseMutex(volatile unsigned short int* mutex) {
  *mutex = UNLOCKED;
}

// Usage
LockMutex(&SharedDataMutex);
// ... Do something with shared data
ReleaseMutext(&SharedDataMutex);
```

Issues:
+ **Priority inversion:** This happens when some high priority task has to wait for a mutex that is locked by a low priority task.
+ **Deadlock:** Two tasks are competing for multiple mutex locks, and each task ends up with a mutex lock needed by the other task.

### Questions

1. What is priority inversion?

**Priority inversion** is a classic problem in real-time and embedded systems where a lower-priority task holds a resource (like a mutex) that a higher-priority task needs, but a medium-priority task preempts the lower one, causing the high-priority task to be blocked longer than necessary.

**Scenario:**
+ Low-Priority Task (L) locks a shared resource (e.g., takes a mutex).
+ High-Priority Task (H) becomes ready and tries to acquire the same resource.
+ H is now blocked because L still holds the resource.
+ Medium-Priority Task (M) (which doesn’t need the resource) starts running.
+ Since M has higher priority than L, it preempts L.
+ Now L cannot run → cannot release the resource → H stays blocked indefinitely.

2. What are the solutions for priority inversion?

+ Priority inheritance
+ Priority ceiling
+ Avoid shared resources
+ Watchdog monitoring

3. What is priority inheritance?

+ Boost on contention
+ Temporarily boosts the priority of L to match that of H.
+ This prevents medium-priority tasks (M) from preempting L.
+ Once L releases the resource, its priority drops back to its original level.

4. What is priority ceiling?

+ Boost on lock
+ Immediately boosts the task's priority to the resource’s ceiling, regardless of whether contention exists.
+ This prevents all tasks with lower priority than the ceiling from preempting the task while it holds the resource.

5. What is deadlock?

A deadlock is a situation in concurrent or multitasking systems where two or more tasks (or threads) are waiting indefinitely for resources that are held by each other, such that none of them can proceed.

+ Resource Ordering: Always acquire resources in a fixed global order
+ Timeouts on Locks: If timeout expires, release already held resources and retry
+ Avoid Nested Locks: Try to avoid taking multiple mutexes in the same task
+ Use Deadlock Detection: For complex systems, some RTOSes support run-time deadlock detection tools

6. What is the famous diners problem?

**The Problem**
Imagine five philosophers sitting around a circular table. Each philosopher alternates between two activities:
+ Thinking (non-blocking)
+ Eating (needs resources)

To eat, each philosopher needs two chopsticks: the one on their left and the one on their right.
There are only five chopsticks, placed between each pair of adjacent philosophers.

**The Rules**
+ A philosopher can only eat when holding both chopsticks.
+ Chopsticks are shared resources — only one philosopher can use each at a time.
+ Philosophers don't communicate with each other.

7. What is mutex?

Mutex (short for mutual exclusion) is a blocking lock used to ensure that only one thread or task at a time can access a critical section or shared resource.

+ If a task cannot acquire a mutex (because another task holds it), it will be put to sleep (blocked) until the mutex becomes available.
+ Mutexes typically support priority inheritance to avoid priority inversion.
+ Mutexes can detect and recover from deadlocks more easily than lower-level primitives.

8. What is spinlock?

A spinlock is a non-blocking lock where a task or thread continuously polls (spins) in a loop until the lock becomes available.

+ No context switching: the task stays active, burning CPU cycles.
+ Usually implemented as an atomic variable
+ No priority inheritance — can lead to priority inversion.
+ Very lightweight and fast, especially on multi-core systems where waiting times are short.

9.  Where are spinlocks used?

+ Locking low-level memory access in an ISR-safe way (because of short and safely)

10. What do you mean by atomic operations?

Atomic operations prevent this by ensuring that:
+ No other task can see a half-completed operation.
+ No task can interleave its operations with an atomic one.

11. What is a semaphore?

A semaphore is a synchronization primitive used in operating systems and embedded systems to **control access to shared resources** by multiple tasks or threads. It helps manage concurrency and prevents issues like race conditions and resource conflicts.

At its core, a semaphore is a non-negative integer counter with two atomic operations:
+ wait() (also known as P() or take()): Decrements the semaphore. If the value becomes negative, the calling task blocks until it becomes non-negative again.
+ signal() (also known as V() or give()): Increments the semaphore. If tasks are waiting, one of them is unblocked.

12.  What are the types of semaphore?

+ Counting
+ Binary
+ Mutex

13. What is binary semaphore?

+ Maintains a count representing multiple instances of a resource.
+ Used when more than one unit of a resource is available (e.g., 4 identical hardware buffers).
+ Useful for resource pools, connection slots, or buffer slots.
  
14. When will you use binary semaphore?

15. What is a counting semaphore?

+ Only two values: 0 (unavailable) or 1 (available).
+ Similar to a mutex, but does not track ownership.
+ Often used for event signaling between:
  + Interrupt Service Routines (ISRs)
  + Tasks

1.  Binary semaphore is equivalent to Mutex - True/False. How?

False. Mutex is a special kind of binary semaphore with:
+ Ownership (only the owner can release)
+ Priority inheritance to solve priority inversion

26. Difference between semaphores and disabling/masking of interrupts method?

Both semaphores and disabling interrupts are used in embedded systems for critical section protection, but they are fundamentally different in scope, usage, and side effects. Let's break down the comparison clearly:

27. How can you avoid deadlocks in case of semaphore based designs?

28.  What is message queue?

| Feature                     | Semaphore                                                 | Disabling Interrupts                       |
| --------------------------- | --------------------------------------------------------- | ------------------------------------------ |
| Concept                     | Software synchronization mechanism                        | Hardware-level control to block interrupts |
| Granularity                 | Task-level coordination (multi-task/thread)               | CPU-level atomicity (interrupts only)      |
| Interrupt-safe              | May be unsafe if used in ISRs (except from ISR-safe APIs) | Used inside ISRs or critical sections      |
| Multicore capable           | Yes (if RTOS supports SMP)                                | Usually no — local to one CPU core         |
| CPU resource usage          | Efficient (with context switch if blocking)               | Minimal, but blocks all interrupt handling |
| Priority Inversion handling | Yes (with mutex)                                          | No                                         |
| Blocking behavior           | Yes — task can block and wait                             | No — disables/prevents interruptions only  |

28. What is the role of a scheduler? How does it function?

+ Task Management: Starts, stops, suspends, and resumes tasks.
+ Context Switching: Saves the state (registers, stack pointer) of the current task and loads the state of the next task.
+ Priority Enforcement: Ensures high-priority tasks preempt lower-priority tasks.
+ Time Sharing (if applicable): Provides fairness when tasks have the same priority (Round Robin).
+ Responding to Events: Wakes tasks based on events (e.g., semaphores, queues, timers, ISR signals).

29. What is the difference between a normal OS and RTOS?

30. What are the factors considered for a RTOS selection?

31. What is preemption?

32. What is preemptive multi-tasking/time-sharing? What is its difference with co-operative multi-tasking/time-sharing?

33. Threads are described as lightweight because switching between threads does not involve changing the memory context - True/False ?


34. What is the use of the method of temporarily masking / disabling interrupts ? When is it used ? What should be taken care while doing this method ?

35. Since, disabling/masking of interrupts can be done whent the critical section is ONLY SHORT,What method can be used if the critical section is longer than few source lines or if it involves few lengthy loopings?


36. What is Message passing method? What is its advantages?
37. Tell about the design of Interrupt Handler and Scheduler in RTOS?

38. What is interrupt latency?

Interrupt latency is the time between the occurrence of an interrupt (e.g., a sensor triggers) and the moment the processor starts executing the corresponding Interrupt Service Routine (ISR). Including

+ Time to finish current instruction
+ Time to save processor state (context saving)
+ Interrupt masking/delay by critical sections or higher-priority ISRs
+ Interrupt vector resolution and branching to ISR

39. Even if we never enables interrupts in the code, the processor automatically disables them often during hardware access - True/False? In this case how to reduce interrupt latency?

True. Solutions:

+ Keep ISRs Short: Never do heavy processing inside an ISR. Just capture data and notify a task (via semaphore or queue).
+ Minimize Interrupt Masking: Avoid long critical sections that disable interrupts. If you're using `taskENTER_CRITICAL()`, exit it quickly.
+ Use Prioritized Nested Interrupts: Configure the system to allow nested ISRs (if your MCU supports it). Higher-priority interrupts shouldn't be delayed by lower-priority ones.
+ Use Fast Interrupt Handlers: On some ARM Cortex-M devices, use FIRQ or fast interrupt mechanism (e.g., __attribute__((interrupt("FIQ")))).
+ Choose a Faster Interrupt Vectoring Scheme: Some microcontrollers use fixed vector tables (slow), Others use vectored interrupt controllers (e.g., NVIC in Cortex-M — faster).
+ Optimize Clock Speed: Ensure interrupt controller and bus speed aren't bottlenecked.
+ Avoid Flash Wait States: If your ISR vector or code is in flash memory with high wait states, move it to RAM.
+ Avoid Disabling Global Interrupts Unless Necessary: Instead, use fine-grained disabling of only specific interrupt sources when possible.

40. When should we re-enable the interrupts in an ISR and why?

41. How do you measure the latency of your system?

42. What are First Level Interrupt handlers and Second level Interrupt handlers?

43. What could be the typical design/implementation of FLIH and SLIH?

44. Reentrant interrupt handlers might cause a stack overflow from multiple preemptions by the same interrupt vector - True / False?

45. What kind of memory allocation procedure is good for embedded systems?

46. Is there any RTOS that has non-preemptive scheduling?

47. What is reentrant code?
48. What is preemptive multitasking?
49. What is non-preemptive multitasking?

50. What does timeslice refer to?
51. If the time slice is too short then the scheduler will consume too much of processing time - True / False

52. What is I/O bound? What is CPU bound?

53. CFS uses 'nanosecond' granularity accounting, the atomic units by which individual process share the CPU instead of previous notion of 'timeslice' - True/False.

54. When will you choose busy-wait instead of context switch?

55. What are the possible scenarios in which context switching of threads can occur?

56. Can you use mutex/semaphore inside an ISR?

57. Explain a scenari that could cause deadlock? What is the best solution for a deadlock?

58. Will the performance of your application improve if it has only a single thread and it is running on multiple cores of a processor?

59. What will happen if there are more threads requesting for CPU resource such as time?

60. What is Gang Scheduling and how is it useful?

61. Can you sleep in interrupt handler?

62. What is the main drawback for not considering Linux as realtime / RTOS?

63. What is the drawback in using semaphore for synchronization ? How does spinlock help in overcoming it?

64. What does a semaphore consist of ? and What does a spinlock consist of?

65. Why spinlocks are useless in uniprocessor systems?

66. What is the difference between multiprogramming and multiprocessing?

67. What is parallel programming?

68. What are the types of IPC mechanisms?

69. What are the types of synchronization problems and what are the resources that can cause such problems?

70. What is data race?

71. What is Indefinite Postponement / Indefinite blocking or starvation?

72. What are the synchronization relationships that are present in a multithreaded or mulitprogramming applications?

73. How many processes or threads are enough for an application?

74. Tell the advantages and disadvantages of Co-operative multitasking.

75. When should we use mutex and when should we use semaphore?

Use a mutex when:
+ You need to **protect shared resources** (like memory, I/O devices, or global variables).
+ **Only one task** at a time should access a critical section.
+ You want to **avoid priority inversion** — mutexes in FreeRTOS support priority inheritance.
+ You expect **only tasks** to give/take the lock (not from ISRs).
+ You may need **recursive locking** (e.g., a task calling a library that also uses the same mutex).
+ e.g. Shared UART access across multiple tasks

Use binary semaphore when:
+ You want to signal from **an ISR to a task**.
+ You need **event notification** (e.g., button press, DMA complete, sensor ready).
+ You don't need priority inheritance or ownership.
Use counting semaphore when:
+ You have **a pool of identical resources** (e.g., N buffers, N UART channels).
+ You want to count availability or usage of those resources.

76. How do you select a scheduler for your project?

77. What are the types of approach for designing a scheduler

78. Which endianness is: A. x86 families; B. ARM families; C. internet protocols; D. other processors? 

79. Explain how interrupts work. What are some things that you should never do in an interrupt function?

80. Explain when you should use "volatile" in C.

81. Explain UART, SPI, I2C buses. Describe some of the signals in each. At a high-level describe each. Have you ever used any? Where? How? What type of test equipment would you want to use to debug these types of buses? Have you ever used test equipment to do it? Which?

82. Explain how DMA works. What are some of the issues that you need to worry about when using DMA?

83. Where does the interrupt table reside in the memory map for various processor families?

84. In which direction does the stack grow in various processor families?

85. Implement a Count Leading Zero (CLZ) bit algorithm, but don't use the assembler instruction. What optimizations to make it faster? What are some uses of CLZ?

86. What is RISC-V? What is it's claimed pros or cons?

87. List some ARM cores, what are their use cases, and where are their main differences?

ARM core types and use cases
+ **Cortex-M**: microcontroller, real-time (FreeRTOS, bare metal)
+ **Cortex-A**: Linux-capable SoCs (used in Ring devices, Raspberry Pi, etc.)
+ **Cortex-R**: real-time processing in automotive and industrial systems

Key differences
+ **Memory management**: Cortex-A uses an **MMU** for virtual memory, while Cortex-R and Cortex-M use an **MPU** or no memory management.

88. Explain MMU in Cortex-A and and MPU in Cortex-M

MPU manages memory access based on privileged

MMU is a superset of MPU. It control page mapping, caching, and etc.

89. Explain processor pipelines, and the pro/cons of shorter or longer pipelines.

90. Explain fixed-point math. How do you convert a number into a fixed-point, and back again? Have you ever written any C functions or algorithms that used fixed-point math? Why did you?

91. What is a pull-up or pull-down resistor? When might you need to use them?

92. What is "zero copy" or "zero buffer" concept?

93. How do you determine if a memory address is aligned on a 4 byte boundary in C?

94. What hardware debugging protocols are used to communicate with ARM microcontrollers?

95. What processor architecture was the original Arduino based on?

96. What are the basic concepts of what happens before main() is called in C?

97. What are the basic concepts of how printf() works? List and describe some of the special format characters? Show some simple C coding examples.

98. Describe each of the following? SRAM, Pseudo-SRAM, DRAM, ROM, PROM, EPROM, EEPROM, MRAM, FRAM, ...

99.  Show how to declare a pointer to constant data in C. Show how to declare a function pointer in C.

100. How do you multiply without using multiply or divide instructions for a multiplier constant of 10, 31, 132?

101. When do you use memmove() instead of memcpy() in C? Describe why.

102. Why is strlen() sometimes not considered "safe" in C? How to make it safer? What is the newer safer function name?

103. When is the best time to malloc() large blocks of memory in embedded processors? Describe alternate approach if malloc() isn't available or desired to not use it, and describe some things you will need to do to ensure it safely works.

104. Describe symbols on a schematic? What is a printed circuit board?

105. Do you know how to use a logic probe? multimeter? oscilloscope? logic analyzer? function generator? spectrum analyzer? other test equipment? Describe when you might want to use each of these. Have you hooked up and used any of these?

106. What processors or microcontrollers are considered 4-bit? 8-bit? 16-bit? 24-bit? 32-bit? Which have you used in each size group? Which is your favorite or hate?

107. What is Ohm's law?

108. What is Nyquist frequency (rate)? When is this important?

109. What is "wait state"?

110. What are some common logic voltages?

111. What are some common logic famlies?

112. What is a CPLD? an FPGA? Describe why they might be used in an embedded system?

113. List some types of connectors found on test equipment.

114. What is AC? What is DC? Describe the voltage in the wall outlet? Describe the voltage in USB 1.x and 2.x cables?

115. What is RS232? RS432? RS485? MIDI? What do these have in common?

116. What is ESD? Describe the purpose of "pink" ESD bags? black or silvery ESD bag? How do you properly use a ground strap? When should you use a ground strap? How critical is it to use ESD protections? How do you safely move ESD-sensitive boards between different parts of a building?

117. What is "Lockout-Tagout"?

118. What is ISO9001? What is a simple summary of it's concepts?

119. What is A/D? D/A? OpAmp? Comparator Other Components Here? Describe each. What/when might each be used?

120. What host O/S have you used? List experience from most to least used.

121. What embedded RTOS have you used? Have you ever written your own from scratch?

122. Have you ever implemented from scratch any functions from the C Standard Library (that ships with most compilers)? Created your own because functions in C library didn't support something you needed?

123. Have you ever used any encryption algorithms? Did you write your own from scratch or use a library (which one)? Describe which type of algorithms you used and in what situations you used them?

124. What is a CRC algorithm? Why would you use it? What are some CRC algorithms? What issues do you need to worry about when using CRC algorithms that might cause problems? Have you ever written a CRC algorithm from scratch?

125. What issues are a concern for algorithms that read/write data to DRAM instead of SRAM?

126. What is the "escape sequence" for "Hayes Command Set"? Where was this used in the past? Where is it used today?

127. What is the "escape character" for "Epson ESC/P"? Where is this used?

128. After powerup, have you ever initialized a character display using C code? From scratch or library calls?

129. Have you ever written a RAM test from scratch? What are some issues you need to test?

130. Have you ever written code to initialize (configure) low-power self-refreshing DRAM memory after power up (independent of BIOS or other code that did it for the system)? It's likely that most people have never done this.

131. Write code in C to "round up" any number to the next "power of 2", unless the number is already a power of 2. For example, 5 rounds up to 8, 42 rounds up to 64, 128 rounds to 128. When is this algorithm useful?

132. What are two of the hardware protocols used to communicate with SD cards? Which will most likely work with more microcontrollers?

133. What issues concerns software when you WRITE a value to EEPROM memory? FLASH memory?

134. What is NOR-Flash and NAND-Flash memory? Are there any unique software concerns for either?

135. Conceptually, what do you need to do after reconfiguring a digital PLL? What if the digital PLL sources the clock for your microcontroller (and other concerns)?

136. What topics or categories of jokes shouldn't you discuss, tell, forward at work?

137. Have you ever used any power tools for woodworking or metalworking?

138. What is a common expression said when cutting anything to a specific length? (old expression for woodworking)

139. Have you ever 3D printed anything? Have you ever created a 3D model for anything? List one or more 3D file extensions.

140. Do you know how to wire an AC wall outlet or ceiling light? Have you ever done either?

141. Have you ever installed Windows or Linux from scratch on a computer that has a brand-new hard drive?

142. Have you ever "burned" a CD-R or DVD-R disc? Have you ever created an ISO image of a CD or DVD or USB drive or hard drive?

143. Have you ever read the contents of a serial-EEPROM chip from a dead system (though EEPROM chip is ok)?

144. Have you ever written data to a serial-EEPROM chip before it is soldered down to a PCB?

145. How do you erase an "old school" EPROM chip? (has a glass window on top of the chip)

146. Describe any infrared protocols, either for data or remote controlling a TV.

147. What is the most common protocol is used to communicate with a "smart card"? Have you ever written any software to communicate with a "smart card" in an embedded product?

148. What is CAN, LIN, FlexRay? Where are they used? Have you ever used any?

149. What is ARINC 429? Where is it commonly used? Have you ever used it?

150. What in-circuit debuggers or programmers have you used? Which one do you like or hate?

151. Do you know any assembler code? For which processor? What assembler code is your favorite or hate? Have you ever written an assembler from scratch?

152. What is "duff's device"? Have you ever used it?

153. What is dual-port RAM? Why would it be useful in some embedded systems? What concerns do you need to worry about when using it? Have you ever used it? How?

154. Have you ever soldered any electronic kits? Have you ever designed your own PCB(s)? Describe. What is a Gerber file?

155. If you create a circular buffer, what size of buffer might optimized code be slightly faster to execute? why?

156. Describe how to multiply two 256-bit numbers using any 32-bit processor without FPU or special instructions. Two or more methods?
157. implement memcpy (followed by "now optimize it")
158. implement a circular buffer
159. determine whether a given number is a power of two (without using arithmetic operators, if you want)
160. rarely some basic assembly stuff, really just looking for out loud discussion of addressing
161. What is a segmentation fault (this one has lead to some interesting discussions), what other kinds of processor error conditions/exceptions exist?

162. What is an MMU?

+ Each program has virtual memory space
+ Physical memory usually means RAM
+ Virtual and Physical memory is split into pages
+ For 4 KiB page, last 12 bits are offset, remaining bits are page numbers
+ One page table per program
+ Page fault is an exception raised when corresponding data is not in RAM

[virtual memory](https://www.cs.rpi.edu/academics/courses/fall04/os/c12/#:~:text=Pages%20are%20typically%20512%20to,as%20the%20pages%20in%20memory.)

163. Von Neumann vs Harvard architecture

The main difference is that in xVon Neumann arch program data and instruction data are stored in the same memory.

164. Describe the boot process from power-on to OS/kernel start on ARM

For A series,
+ Hardware reset
+ 1st stage Bootloader
  + Initial minimal hardware: clock, memory controller
  + Load 2nd stage Bootloader from storage device
+ 2nd stage Bootloader
  + Setup DRAM
  + Init peripherals
  + Load kernel, device tree
+ Kernel start
  + MMU
  + Scheduler
  + Filesystem

For M series,
+ Hardware reset
+ Vector table and reset handler
+ In handler
  + Clock
  + RAM
  + Interupt vector table
  + HAL drivers
+ main()
  + Init hardwares
  + Init RTOS

1.   How is static keyword different in C++ than C?

2.   Difference between pass by reference and pass by pointer?

3.   How is const used differently in C++ and what is constexpr?

4.   Give a simple example of virtual keyword works. (If they can write some simple classes like Shape, Square, Circle to demonstrate, it is bonus).

5.    **Describe the pros and cons of using a generic real-time operating system (RTOS) on a mid-range microcontroller.**

6.   **What are some common issues when handling interrupts?**

7.   **In platforms with significant constraints on memory size, is it more preferable to allocate memory statically or dynamically?**

8.   **Why are C and C++ still very popular and widely supported in embedded firmware development?**

9.   **How many wires are required to reliably implement TTL-like serial communication between two devices, and why?**

10.  **Since 32-bit and 64-bit microcontrollers exist, why are 8-bit ones still in use?**

11.  **Is firmware and data embedded in microcontrollers generally safe from downloading, tampering, or hacking?**

12.  **Describe the role of a watchdog timer.**

13.  **What are the most important characteristics of UART-based, I2C, and SPI serial communication?**

14.  **Discuss a couple of options for wireless communication between embedded devices.**

Then, some microcontroller specific questions (Like internals - ISR, pipelines, peripherals, etc.)

And some RTOS specific questions (Slightly higher level - mutex vs semaphore, scheduling policies, context switches)

And then Linux questions(OS tools used - ssh, vim, bash/python scripting, git, gcc, man pages? Systems level knowledge - use of read(), write(), poll(), sockets, fork(), system calls, Device drivers - very very high level idea only)

### Aspects

#### C Language

+ Pointers
+ Addresses
+ Multithreading
+ Data Structures

#### Embedded Software Programming

#### Focus

+ Super loop, while loop
+ GPIOs
+ DAC/ADC
+ Interupts
+ Hardware Communication Protocol: SPI/I2C/UART
+ DMA
+ Memory Management
+ RTOS

+ What is SPI?
4 data lines, MISO, MOSI, clock, chip select. When the chip select pull low, the device is activated. Fully synchronized interface, sending and receiving at the same time, parallel

+ How DMA works?

CPU can configurate the DMA to transfer data from peripheral to memory, memory to memory, and memory to peripheral. After configure, CPU don't need to care about this data transfer

+ What is semaphore, how is it different from mutex

Ownership. Access limit

+ How to collect data in parallel and in sync?

Use timer(for sync) and DMA (for parallelism)

+ When to use `volatile`

For variables that are used in critical section such as interupt, memory mapped register, or variables that are used between threads

+ How to minimize MCU power consumption

Use power mode offered by the MCU. 
Lowering the CPU clock speed when it's not needed. 
Optimize the code so that it runs in few clock cycles.
Turn off peripherals when they are not used.
Tickless idle mode

+ Why RTOS?

Scheduler

+ ISR

Keep short, dont log, print, delay inside. Dont use semaphore or mutex, not crazy loop

+ Big/Little endianness

+ Pull up/down resistor

Pull up resistor is to keep an unused input pin at a high value

These questions cover essential concepts relevant to embedded systems engineering. Let me know if you'd like to explore answers or dive deeper into any of them!

## Multithreading

### IPC with ZeroMQ and Protobuf

```protobuf
syntax = "proto3";

enum MessageType {
  NONE = 0;
  DEBUG = 1;
  WARNING = 2;
  ERROR = 3;
}

message Message {
  string text = 1;
  MessageType = 2;
}

message Info {
  string date = 1;
  int32 id = 2;
  repeated Message messages = 3;
}
```

App A as publisher

```cpp
#include <iostream>

#include "zmq.hpp"
#include "generated/message.ph.h"

int main() {
  zmq::context_t context{1};

  // Socket to clients
  zmq::socket_t publisher{context, zmq::socket_type::pub};

  // What is High Water Mark?
  int sndhwm = 0;
  publisher.set(zmq::socketopt::sndwhm, sndwhm);

  publisher.bind("tcp://*:5561");

  zmq::socket_t syncService{context, zmq::socket_type::rep};
  syncService.bind("tcp://*:5562");
  
  constexpr auto kExpectedSubscribers = 10;
  int subscribers = 0;
  zmq::message_t syncMessage;
  while (subscribers < kExpectedSubscribers) {
    std::cout << "Wait for sync req";
    syncService.recv(syncMessage);

    std::cout << "Send sync reply";
    syncService.send(syncMessage, zmq::send_flags::none);
  }
}
```
## General

1. Is there a difference between `class` and `struct`?
2. What will the following code print out and why?  
   ```cpp
   #include <iostream>  
   int main(int argc, char **argv) {  
       std::cout << 25u - 50;  
       return 0;  
   }
   ```
3. What is the error in the following code, and how should it be corrected?  
   ```cpp
   my_struct_t *bar;  
   /* ... do stuff, including setting bar to point to a defined my_struct_t object ... */  
   memset(bar, 0, sizeof(bar));
   ```
4. What will `i` and `j` equal after the following code is executed? Explain your answer.  
   ```cpp
   int i = 5;  
   int j = i++;
   ```
5. Assuming `buf` is a valid pointer, what is the problem in the following code? What alternative implementation would avoid this problem?  
   ```cpp
   size_t sz = buf->size();  
   while (--sz >= 0) {  
       /* do something */  
   }
   ```
6. Consider the two code snippets for printing a `vector`. Is one approach better than the other? Explain.  
7. Implement a template function `IsDerivedFrom()` that checks if class `C` is derived from class `P`.
8. Implement a template boolean function `IsSameClass()` that compares two classes.
9. Is it possible to have a recursive inline function?
10. What will be the output of the following code?  
11. Given the `Something` class, implement a method to retrieve `topSecretValue` without relying on `sizeof(int, bool, string)`.
12. Implement a function `F` that takes two integer arrays (`A` and `B`) and size `N`, ensuring `B[i]` is the product of all elements in `A` except `A[i]`.
13. When should virtual inheritance be used?
14. What is the output of the following code?  
15. What is the output of the following C++ program that involves virtual functions and destructors?
16. How many times will this loop execute? Explain your answer.
17. How can you ensure a function can only be called with specific parameter types?
18. What is the problem with the following inheritance structure?
19. What is a storage class?
20. How can a C function be called from a C++ program?
21. What will be the output of the following program using struct and pointer manipulation?
22. Are static const member functions allowed? Explain your answer.
23. Explain the `volatile` and `mutable` keywords.
24. What is the "diamond problem" in multiple inheritance? Provide an example.